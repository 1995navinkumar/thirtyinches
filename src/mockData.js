const { uniqueNamesGenerator, names, countries, NumberDictionary } = require('unique-names-generator');

import {
    getFirestore, collection, doc,
    getDocs, addDoc, deleteDoc, updateDoc,
    query, where, arrayUnion, onSnapshot,
    writeBatch
} from "firebase/firestore";

import * as dbUtils from './utils/db-util';

import { getAuth } from "firebase/auth";

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

var generated = false;

export async function generateData() {
    if (generated) {
        return
    }

    generated = true;

    generateOrgs(2)
        .forEach(org => {
            dbUtils.createOrg(org)
                .then(orgRef => {
                    generateBranches(2)
                        .forEach(branch => {
                            dbUtils.addBranch(orgRef, branch)
                                .then(branchRef => {
                                    generateSubscribers()
                                        .forEach(subscriber => {
                                            dbUtils.addSubscriber({ ...subscriber, orgId: orgRef.id, branchName: branch.name })
                                                .then(subscriberRef => {
                                                    generateSubscriptions(2)
                                                        .forEach(subcription => {
                                                            dbUtils.addNewSubscription(subscriberRef, subcription)
                                                        })
                                                })
                                        });
                                })
                        })
                })
        });


    // subscribers






}
