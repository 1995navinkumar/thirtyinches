const express = require("express");
const router = express.Router();
const getDB = require("../mongo");

router.get("/:orgName/:cardName", async function (req, res) {
    var { orgName, cardName } = req.params;
    var { noOfMonthsBefore } = req.query;
    var db = await getDB(req.dbname);
    var collections = await cardHandlers[cardName](db, orgName, noOfMonthsBefore);
    res.json(collections);
});

var cardHandlers = {
    incomeVersusExpense,
    subscriptionCount,
    expenseAndAssetCount
}

async function expenseAndAssetCount(db, orgName, noOfMonthsBefore = 3) {
    var gt = new Date(Date.now() - (noOfMonthsBefore * 30 * 24 * 3600 * 1000));

    var expenses = await db.collection("expenses")
        .aggregate([
            {
                '$match': {
                    orgName,
                    'billDate': {
                        '$gte': gt
                    }
                }
            },
            {
                '$group': {
                    '_id': {
                        'year': {
                            '$year': '$billDate'
                        },
                        'month': {
                            '$month': '$billDate'
                        }
                    },
                    'expenseCount': {
                        $count: {}
                    }
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'year': '$_id.year',
                    'month': '$_id.month',
                    'expenseCount': 1
                }
            }, {
                '$sort': {
                    'year': -1,
                    'month': -1
                }
            }
        ])
        .toArray();

    var assets = await db.collection("assets")
        .aggregate([
            {
                '$match': {
                    orgName,
                    'purchaseDate': {
                        '$gte': gt
                    }
                }
            },
            {
                '$group': {
                    '_id': {
                        'year': {
                            '$year': '$purchaseDate'
                        },
                        'month': {
                            '$month': '$purchaseDate'
                        }
                    },
                    'assetCount': {
                        $count: {}
                    }
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'year': '$_id.year',
                    'month': '$_id.month',
                    'assetCount': 1
                }
            }, {
                '$sort': {
                    'year': -1,
                    'month': -1
                }
            }
        ]).toArray()

    var grouped = groupByYearMonth([...expenses, ...assets]);

    return Object
        .values(grouped)
        .sort((a, b) => (b.year - a.year) || (b.month - a.month));
}

async function subscriptionCount(db, orgName, noOfMonthsBefore = 3) {
    var gt = new Date(Date.now() - (noOfMonthsBefore * 30 * 24 * 3600 * 1000));

    var subscriptions = await db.collection("subscribers")
        .aggregate([
            {
                $match: {
                    orgName
                }
            },
            {
                $project: {
                    subscriptions: 1
                }
            },
            {
                '$unwind': {
                    'path': '$subscriptions'
                }
            },
            {
                '$match': {
                    'subscriptions.start': {
                        '$gte': gt
                    }
                }
            },
            {
                '$group': {
                    '_id': {
                        'year': {
                            '$year': '$subscriptions.start'
                        },
                        'month': {
                            '$month': '$subscriptions.start'
                        }
                    },
                    'subscriptions': {
                        $count: {}
                    }
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'year': '$_id.year',
                    'month': '$_id.month',
                    'subscriptions': 1
                }
            },
            {
                '$sort': {
                    'year': -1,
                    'month': -1
                }
            }
        ]).toArray()

    return subscriptions;

}

async function incomeVersusExpense(db, orgName, noOfMonthsBefore = 3) {
    var gt = new Date(Date.now() - (noOfMonthsBefore * 30 * 24 * 3600 * 1000));

    var income = await db.collection("subscribers")
        .aggregate([
            {
                $match: {
                    orgName
                }
            },
            {
                $project: {
                    subscriptions: 1
                }
            },
            {
                '$unwind': {
                    'path': '$subscriptions'
                }
            },
            {
                '$match': {
                    'subscriptions.start': {
                        '$gte': gt
                    }
                }
            },
            {
                '$group': {
                    '_id': {
                        'year': {
                            '$year': '$subscriptions.start'
                        },
                        'month': {
                            '$month': '$subscriptions.start'
                        }
                    },
                    'subscriptions': {
                        '$sum': '$subscriptions.amount'
                    }
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'year': '$_id.year',
                    'month': '$_id.month',
                    'subscriptions': 1
                }
            },
            {
                '$sort': {
                    'year': -1,
                    'month': -1
                }
            }
        ])
        .toArray();


    var expenses = await db.collection("expenses")
        .aggregate([
            {
                '$match': {
                    orgName,
                    'billDate': {
                        '$gte': gt
                    }
                }
            },
            {
                '$group': {
                    '_id': {
                        'year': {
                            '$year': '$billDate'
                        },
                        'month': {
                            '$month': '$billDate'
                        },
                        'category': '$category'
                    },
                    'totalAmount': {
                        '$sum': '$amount'
                    }
                }
            }, {
                '$group': {
                    '_id': {
                        'year': '$_id.year',
                        'month': '$_id.month'
                    },
                    'amount': {
                        '$push': {
                            'k': '$_id.category',
                            'v': '$totalAmount'
                        }
                    }
                }
            }, {
                '$project': {
                    'amount': {
                        '$arrayToObject': '$amount'
                    }
                }
            }, {
                '$sort': {
                    '_id.year': -1,
                    '_id.month': -1
                }
            }
        ])
        .toArray();

    expenses = expenses.flatMap(e => ({
        ...e._id,
        ...e.amount
    }));

    var groupByMonth = groupByYearMonth([...expenses, ...income])

    return Object
        .values(groupByMonth)
        .sort((a, b) => (b.year - a.year) || (b.month - a.month));

}

let groupByYearMonth = (arr) => {
    return arr.reduce((a, c) => {
        let key = `${c.year}_${c.month}`;
        if (key in a) {
            a[key] = { ...a[key], ...c };
        } else {
            a[key] = { ...c };
        }
        return a;
    }, {});
}

module.exports = router;