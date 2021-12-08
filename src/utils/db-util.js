import {
    getFirestore, collection, doc,
    getDocs, addDoc, deleteDoc, updateDoc,
    query, where, arrayUnion, onSnapshot,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

export async function createOrg(orgDetails) {
    var user = getAuth().currentUser;
    const db = getFirestore();

    // validation to be added

    return addDoc(collection(db, "orgs"), {
        ...orgDetails,
        userId: user.email
    });

}

export async function addBranch(orgRef, branchDetails) {
    return updateDoc(orgRef, {
        branches: arrayUnion({
            ...branchDetails
        })
    })
}

export async function addOrgDetails(details) {
    var user = getAuth().currentUser;
    const db = getFirestore();

    var [orgName, branchName, branchAddress, contact] = details;

    try {
        const orgDocRef = await addDoc(collection(db, "orgs"), {
            userId: user.email,
            name: orgName,
            branches: arrayUnion({
                name: branchName,
                address: branchAddress,
                contact
            })
        });
        return orgDocRef;

    } catch (er) {
        console.log(er);
        return false;
    }

}

export async function getOrgDetails() {
    var user = getAuth().currentUser;
    const db = getFirestore();

    // const q = query(collection(db, "orgs"), where("userId", "==", user.email));
    const q = query(collection(db, "orgs"));

    return getDocs(q)
        .then(snapshot => {
            return !snapshot.empty ? snapshot.docs.map(d => ({ id: d.id, ...d.data() })) : [];
        })
        .catch(er => { throw er });
}

export async function deleteOrg(org) {
    const db = getFirestore();
    return deleteDoc(
        doc(db, "orgs", org.id)
    )
        .then(() => {
            var q = query(collection(db, "branches"), where("orgId", "==", org.id));
            getDocs(q).then(sn => {
                sn.forEach(d => deleteDoc(d.ref));
            })
        })
        .catch(console.log)
}

export function subscribeToOrgs(setOrgs) {
    var db = getFirestore();
    var q = query(collection(db, "orgs"));

    return onSnapshot(q, (snapshot) => {
        var orgs = [];
        snapshot.forEach(d =>
            orgs.push({
                ...d.data(),
                id: d.id
            })
        );
        setOrgs(orgs);
    })
}


// ------------------------------------ Subscriptions -----------------------------------------

export async function addSubscriber(subscriberDetail) {
    var db = getFirestore();
    var subscribersRef = collection(db, "subscribers");

    // add validation

    return addDoc(subscribersRef, {
        ...subscriberDetail
    })
}


export async function addNewSubscription(subscriberRef, subscriptionDetail) {
    return updateDoc(subscriberRef, {
        subscriptions: arrayUnion(subscriptionDetail)
    })
}


export async function addSubscription(subscriberDetail, subscriptionDetail) {
    var db = getFirestore();
    var subscribersRef = collection(db, "subscribers");

    return addDoc(subscribersRef, {
        ...subscriberDetail,
        subscriptions: arrayUnion(subscriptionDetail)
    })
        .then(console.log)
        .catch(console.log)

}


export async function getAllSubscribers(orgId) {
    var db = getFirestore();
    var subscribersRef = collection(db, "subscribers");
    var q = query(subscribersRef, where("orgId", "==", orgId));
    return getDocs(q)
        .then(snapshot => {
            return !snapshot.empty ? snapshot.docs.map(d => ({ id: d.id, ...d.data() })) : [];
        })
        .catch(console.log);
}