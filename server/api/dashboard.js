const express = require("express");
const router = express.Router();
const getDB = require("../mongo");

router.get("/:cardName", async function (req, res) {
    var { cardName } = req.params;
    var { noOfMonthsBefore } = req.query;
    var db = await getDB(req.dbname);
    var collections = await cardHandlers[cardName](db, noOfMonthsBefore);
    res.json(collections);
});

var cardHandlers = {
    incomeVersusExpense
}

async function incomeVersusExpense(db, noOfMonthsBefore = 3) {
    var gt = new Date(Date.now() - (noOfMonthsBefore * 30 * 24 * 3600 * 1000));

    // appLogger.info(ISODate);

    // var currentMonth = (new Date()).getMonth();

    var income = await db.collection("subscribers")
        .aggregate([
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
            }, {
                '$project': {
                    '_id': 0,
                    'year': '$_id.year',
                    'month': '$_id.month',
                    'subscriptions': 1
                }
            }, {
                '$sort': {
                    'year': 1,
                    'month': 1
                }
            }
        ])
        .toArray();


    var expenses = await db.collection("expenses")
        .aggregate([
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
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ])
        .toArray();

    expenses = expenses.flatMap(e => ({
        ...e._id,
        ...e.amount
    }));

    var groupByMonth = [...expenses, ...income]
        .reduce((a, c) => {
            if (c.month in a) {
                a[c.month] = { ...a[c.month], ...c };
            } else {
                a[c.month] = { ...c };
            }
            return a;
        }, {});



    return Object
        .values(groupByMonth)
        .sort((a, b) => (a.year - b.year) || (a.month - b.month));

}

module.exports = router;