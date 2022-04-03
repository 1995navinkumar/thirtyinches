import { uniqueNamesGenerator, names, countries, NumberDictionary } from 'unique-names-generator';

import * as apiUtils from "./src/utils/api-util";

window.apiUtils = apiUtils;

export async function generateData() {


    var orgs, branches, subscribers, subscriptions;

    orgs = generateOrgs(2);

    for (var orgIdx = 0; orgIdx < orgs.length; orgIdx++) {
        var org = orgs[orgIdx];


        branches = generateBranches(2);


        await apiUtils.createOrg(org.name, branches[0]);

        for (let brIdx = 1; brIdx < branches.length; brIdx++) {
            var branch = branches[brIdx];
            await apiUtils.createBranch(org.name, branch);
        }

        // branches = branches.slice(1);
        org.branches = branches; // mutation

        for (let brIdx = 0; brIdx < branches.length; brIdx++) {
            var branch = branches[brIdx];

            var assets = generateAssets();
            for (var assetIdx = 0; assetIdx < assets.length; assetIdx++) {
                var asset = assets[assetIdx];
                await apiUtils.addAsset(org.name, {
                    branchName: branch.name,
                    ...asset
                });
            }


            var expenses = generateExpenses();
            for (var expIdx = 0; expIdx < expenses.length; expIdx++) {
                var expense = expenses[expIdx];
                await apiUtils.addExpense(org.name, {
                    branchName: branch.name,
                    ...expense
                });
            }

            subscribers = generateSubscribers();
            for (var subIdx = 0; subIdx < subscribers.length; subIdx++) {
                var subscriber = subscribers[subIdx];


                subscriptions = generateSubscriptions(3, branch.name);

                // await apiUtils.addSubscriber(org.name, branch.name, subscriber);

                await apiUtils.addSubscription(org.name, subscriber, subscriptions[0]);

                // subscriptions = subscriptions.slice(1);

                for (let sbnIdx = 1; sbnIdx < subscriptions.length; sbnIdx++) {
                    var subscription = subscriptions[sbnIdx];
                    await apiUtils.renewSubscription(org.name, subscriber.contact, subscription);
                }

                for (let sbnIdx = 0; sbnIdx < subscriptions.length; sbnIdx++) {
                    var subscription = subscriptions[sbnIdx];
                    var { start, end } = subscription;
                    var diff = end - start;

                    var reasonableDiff = Math.floor(Math.random() * diff);

                    var reasonableDayDiff = Math.floor(reasonableDiff / (1000 * 3600 * 24));

                    for (var dateIdx = 0; dateIdx < reasonableDayDiff % 10; dateIdx++) {
                        var timestamp = start + reasonableDiff;
                        await apiUtils.markAttendance(
                            org.name,
                            branch.name,
                            subscriber.contact,
                            timestamp
                        )
                    }

                }
            }
        }
    }


    var roles = generateRoles();

    await apiUtils.addDefaultRoles(roles);

    var users = [
        "orgadmin@example.com",
        "orgmoderator@example.com",
        "branchadmin@example.com",
        "technician@example.com"
    ];

    // org admin

    // await apiUtils.addPrivilege({
    //     userId: users[0],
    //     roleName: "OrgAdmin",
    //     orgName: orgs[0].name,
    //     branches: orgs[0].branches.map(b => b.name)
    // })

    // org moderator

    await apiUtils.addPrivilege({
        userId: users[1],
        roleName: "OrgModerator",
        orgName: orgs[1].name,
        branches: orgs[1].branches.map(b => b.name)
    });

    // branch admin

    await apiUtils.addPrivilege({
        userId: users[2],
        roleName: "BranchAdmin",
        orgName: orgs[0].name,
        branches: [orgs[0].branches[0].name]
    });


    // technician

    await apiUtils.addPrivilege({
        userId: users[3],
        roleName: "Technician",
        orgName: orgs[0].name,
        branches: orgs[0].branches.map(b => b.name)
    });

}


function generatePrivileges() {
    return [

        "org_read",
        "org_write",

        "branch_read",
        "branch_write",

        // "org_user_read",
        // "org_user_write",

        // "branch_user_read",
        // "branch_user_write",

        // "org_role_read",
        // "org_role_write",

        // "branch_role_read",
        // "branch_role_write",

        "subscriber_read",
        "subsriber_write",

        "expense_read",
        "expense_write",

        "asset_read",
        "asset_write",

        "attendance_read",
        "attendance_write"
    ]
}

function generateRoles() {
    var privileges = generatePrivileges();
    return [
        {
            name: "OrgAdmin",
            privileges
        }, {
            name: "OrgModerator",
            privileges: privileges.filter(p => !["org_write"].includes(p))
        }, {
            name: "BranchAdmin",
            privileges: privileges.filter(
                p => ![
                    "org_read", "org_write", "org_user_read",
                    "org_user_write",
                    "org_role_read",
                    "org_role_write",
                ]
                    .includes(p))
        }, {
            name: "Technician",
            privileges: ["subscriber_read",
                "subsriber_write",

                "expense_read",
                "expense_write",

                "asset_read",
                "asset_write",

                "attendance_read",
                "attendance_write"]
        }
    ]
}

function randomDate(start = new Date(1980, 0, 1), end = new Date(2010, 0, 1)) {
    var date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.getTime();
}


function generateOrgs(orgLimit = 1) {
    return new Array(orgLimit)
        .fill(0)
        .map(org => {
            return {
                name: uniqueNamesGenerator({ dictionaries: [names] })
            }
        })
}

function generateBranches(branchLimit = 1) {
    return new Array(branchLimit)
        .fill(0)
        .map(br => {
            return {
                name: uniqueNamesGenerator({ dictionaries: [names] }),
                address: uniqueNamesGenerator({ dictionaries: [countries] }),
                contact: uniqueNamesGenerator({ dictionaries: [NumberDictionary.generate({ length: 10 })] })
            }
        })
}

var expenseCategory = [
    "Maintenance",
    "Wage",
    "Asset Purchase",
    "Misc"
]


var expenseCount = 0;

function generateExpenses(limit = 10) {
    var sixMonthsFromNow = 6 * 30 * 24 * 60 * 60 * 1000;
    var generateRandomTime = () => (new Date(Date.now() - (sixMonthsFromNow * Math.random()))).getTime();

    return new Array(limit)
        .fill(0)
        .map((el, idx) => {
            return {
                title: `Expense_${expenseCount++}`,
                description: "expense",
                amount: Math.ceil(Math.random() * 5000),
                billDate: generateRandomTime(),
                category: expenseCategory[Math.floor(Math.random() * expenseCategory.length)]
            }
        })
}

var assets = ["Training Bench ", "Dumbbell Set ", "Barbell Set ", "Kettlebell Set ", "Pull-Up Frame and Bar ", "Treadmill ", "Stationary Bicycle ", "Rowing Machine ", "Fitness Ball ", "Accessories"]
var assetCount = 0;

function generateAssets(limit = 10) {
    var sixMonthsFromNow = 6 * 30 * 24 * 60 * 60 * 1000;
    var generateRandomTime = () => (new Date(Date.now() - (sixMonthsFromNow * Math.random()))).getTime();

    return new Array(limit)
        .fill(0)
        .map(() => {
            return {
                assetName: `${assets[Math.random() * 10 | 1]}_${assetCount++}`,
                description: "asset",
                price: Math.ceil(Math.random() * 5000),
                quantity: (Math.random() * 10) | 1,
                purchaseDate: generateRandomTime()
            }
        })
}

function generateSubscribers(limit = 10) {
    return new Array(limit)
        .fill(0)
        .map(sub => {
            return {
                name: uniqueNamesGenerator({ dictionaries: [names] }),
                dob: randomDate(),
                address: uniqueNamesGenerator({ dictionaries: [countries] }),
                contact: +(uniqueNamesGenerator({ dictionaries: [NumberDictionary.generate({ length: 10 })] }))
            }
        })
}

function generateSubscriptions(limit = 3, branchName) {
    var now = Date.now();
    var oneDay = 24 * 3600 * 1000;

    var getRandomDate = (max) => {
        return Math.floor((Math.random() * max * oneDay))
    }

    var canMakeActiveSubscription = Math.random() < 0.75;

    var start = now - getRandomDate(100);
    var end = start + (canMakeActiveSubscription ? getRandomDate(365) : getRandomDate(30));

    var dates = [];

    dates.push({ start, end });

    var generateDate = () => {
        var previousStart = dates[dates.length - 1].start;
        let nextStart = previousStart - getRandomDate(365);
        let nextEnd = nextStart + Math.floor(Math.random() * (previousStart - nextStart));

        dates.push({
            start: nextStart,
            end: nextEnd
        });
    }

    new Array(limit - 1)
        .fill(0)
        .forEach(generateDate);

    return new Array(limit)
        .fill(0)
        .map((sub, idx) => {
            return {
                ...dates[idx],
                amount: Math.floor(Math.random() * 4000),
                branchName
            }
        })
}

window.generateData = generateData;
