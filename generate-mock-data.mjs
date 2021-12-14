import { initializeApp } from "firebase/app";

import { getAuth, connectAuthEmulator } from "firebase/auth";

import { uniqueNamesGenerator, names, countries, NumberDictionary } from 'unique-names-generator';

import * as dbUtils from "./src/utils/db-util.js";

import { connectFirestoreEmulator, getFirestore, collection, addDoc } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyD5q3f_PQWbMmY95Ao3pv3u48xRpz-p_Ls",
    authDomain: "gym-management-dfd3b.firebaseapp.com",
    projectId: "gym-management-dfd3b",
    storageBucket: "gym-management-dfd3b.appspot.com",
    messagingSenderId: "878638516602",
    appId: "1:878638516602:web:c86af309222d834ab42ec3",
    measurementId: "G-KPE00KH76M"
};

var app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, 'localhost', 9010);

generateData();

async function generateData() {

    var orgs, branches, subscribers, subscriptions;

    orgs = generateOrgs(2);

    for (var orgIdx = 0; orgIdx < orgs.length; orgIdx++) {
        var org = orgs[orgIdx];
        branches = generateBranches(2);
        org.branches = branches; // mutation

        for (var brIdx = 0; brIdx < branches.length; brIdx++) {
            var branch = branches[brIdx];
            await dbUtils.createBranch(org.name, branch);

            var assets = generateAssets();
            for (var assetIdx = 0; assetIdx < assets.length; assetIdx++) {
                var asset = assets[assetIdx];
                await dbUtils.addAsset(org.name, branch.name, asset);
            }


            var expenses = generateExpenses();
            for (var expIdx = 0; expIdx < expenses.length; expIdx++) {
                var expense = expenses[expIdx];
                await dbUtils.addExpense(org.name, branch.name, expense);
            }

            subscribers = generateSubscribers();
            for (var subIdx = 0; subIdx < subscribers.length; subIdx++) {
                var subscriber = subscribers[subIdx];
                var subscriberRef = await dbUtils.addSubscriber(org.name, branch.name, subscriber);


                subscriptions = generateSubscriptions(3);
                for (var sbnIdx = 0; sbnIdx < subscriptions.length; sbnIdx++) {
                    var subscription = subscriptions[sbnIdx];
                    await dbUtils.addSubscription(subscriberRef.id, subscription);

                    var { start, end } = subscription;
                    var diff = end - start;

                    var reasonableDiff = Math.floor(Math.random() * diff);

                    var reasonableDayDiff = Math.floor(reasonableDiff / (1000 * 3600 * 24));

                    for (var dateIdx = 0; dateIdx < reasonableDayDiff % 10; dateIdx++) {
                        var timestamp = start + reasonableDiff;
                        await dbUtils.markAttendance(
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
    var rolesRef = collection(db, "roles");

    for (var roleIdx = 0; roleIdx < roles.length; roleIdx++) {
        var role = roles[roleIdx];
        await addDoc(rolesRef, {
            ...role
        })
    }

    var users = [
        "orgadmin@example.com",
        "orgmoderator@example.com",
        "branchadmin@example.com",
        "technician@example.com"
    ];

    // org admin

    var usersRef = collection(db, "userPrivileges");

    await addDoc(usersRef, {
        userId: users[0],
        roleName: "OrgAdmin",
        orgName: orgs[0].name,
        branches: orgs[0].branches.map(b => b.name)
    });

    await addDoc(usersRef, {
        userId: users[0],
        roleName: "OrgAdmin",
        orgName: orgs[1].name,
        branches: orgs[1].branches.map(b => b.name)
    });

    // org moderator

    await addDoc(usersRef, {
        userId: users[1],
        roleName: "OrgModerator",
        orgName: orgs[1].name,
        branches: orgs[1].branches.map(b => b.name)
    });

    // branch admin
    await addDoc(usersRef, {
        userId: users[2],
        roleName: "BranchAdmin",
        orgName: orgs[0].name,
        branches: [orgs[0].branches[0].name]
    });


    // technician

    await addDoc(usersRef, {
        userId: users[3],
        roleName: "Technician",
        orgName: orgs[0].name,
        branches: orgs[0].branches.map(b => b.name)
    });

    process.exit(1);

}


function generatePrivileges() {
    return [

        "org_read",
        "org_write",

        "branch_read",
        "branch_write",

        "org_user_read",
        "org_user_write",

        "branch_user_read",
        "branch_user_write",

        "org_role_read",
        "org_role_write",

        "branch_role_read",
        "branch_role_write",

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

function generateExpenses(limit = 10) {
    return new Array(limit)
        .fill(0)
        .map((el, idx) => {
            return {
                title: `Expense_${idx + 1}`,
                description: "expense",
                amount: Math.ceil(Math.random() * 5000)
            }
        })
}

function generateAssets(limit = 10) {
    return new Array(limit)
        .fill(0)
        .map(() => {
            return {
                title: `dumbbell_${Math.ceil(Math.random() * 30)}kg`,
                description: "asset",
                cost: Math.ceil(Math.random() * 5000)
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
                contact: uniqueNamesGenerator({ dictionaries: [NumberDictionary.generate({ length: 10 })] })
            }
        })
}

function generateSubscriptions(limit = 3) {
    var oneDay = 1 * 1000 * 60 * 60 * 24;
    var now = new Date(Date.now()).getTime();
    var previousEndDate = new Date(now + (oneDay * 30) + (Math.random() * oneDay * 365)).getTime();

    var generateDate = () => {
        var start = new Date(previousEndDate - (Math.random() * oneDay * 365)).getTime();
        var end = previousEndDate;

        previousEndDate = new Date(start - oneDay * 30).getTime();
        return {
            start, end
        }
    }

    return new Array(limit)
        .fill(0)
        .map(sub => {
            return {
                ...generateDate(),
                amountPaid: Math.floor(Math.random() * 4000)
            }
        })
}
