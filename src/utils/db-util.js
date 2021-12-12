import {
    getFirestore, collection, doc,
    getDocs, addDoc, deleteDoc, updateDoc,
    query, where, arrayUnion, onSnapshot, setDoc, getDoc,
} from "firebase/firestore";

export async function createBranch(orgName, branchDetails) {
    var db = getFirestore();

    var q = query(collection(db, "orgs"), where("name", "==", orgName));

    var org = await getDocs(q).then(getData);

    if (org) {
        return updateDoc(doc(db, "orgs", org[0].id), {
            branches: arrayUnion(branchDetails)
        })
    } else {
        return addDoc(collection(db, "orgs"), {
            name: orgName,
            branches: arrayUnion(branchDetails)
        })
    }

}

export async function getOrgDetails(userId) {
    const db = getFirestore();


    var q = query(collection(db, "users"), where("userId", "==", userId));

    var orgs = await getDocs(q).then(getData) || [];

    var orgDetails = [];

    for (var orgIdx = 0; orgIdx < orgs.length; orgIdx++) {
        var { orgName, branches } = orgs[orgIdx];
        q = query(collection(db, "orgs"), where("name", "==", orgName));

        var orgDetail = await getDocs(q).then(getData);

        orgDetail[0].branches = orgDetail[0].branches.filter(br => branches.includes(br.name));

        orgDetails.push(orgDetail[0]);
    }

    q = query(collection(db, "personalisation"), where("userId", "==", userId));

    var personalisationData = await getDocs(q).then(getData);

    if (personalisationData) {
        var { selectedOrg } = personalisationData[0];
        orgDetails.find(org => org.name == selectedOrg).selected = true;
    }

    return orgDetails;

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

export async function addSubscriber(orgName, branchName, subscriberDetail) {
    var db = getFirestore();
    var subscribersRef = collection(db, "subscribers");

    // add validation

    return addDoc(subscribersRef, {
        ...subscriberDetail,
        orgName,
        branchName
    })
}

export async function addSubscription(subscriberId, subscriptionDetail) {
    var db = getFirestore();
    var subscriberDocRef = doc(db, "subscribers", subscriberId);
    return updateDoc(subscriberDocRef, {
        subscriptions: arrayUnion(subscriptionDetail)
    })
}


export async function getAllSubscribers(orgName, branchNames) {
    var db = getFirestore();
    var q = query(collection(db, "subscribers"), where("orgName", "==", orgName), where("branchName", "in", branchNames));
    return await getDocs(q).then(getData);
}


// Privileges

export async function addPrivilege(p) {
    var db = getFirestore();
    var privilegesRef = collection(db, "privileges");
    return addDoc(privilegesRef, {
        name: p
    });
}

export async function addRole(orgName, role) {
    var db = getFirestore();
    var orgsRef = collection(db, "orgs");
    var orgId = await getOrgId(orgName);
    if (orgId) {
        return updateDoc(doc(orgsRef, orgId), {
            roles: arrayUnion(role)
        });
    }
}

export async function addPersonalisedData(userId, data) {
    var db = getFirestore();
    var persRef = collection(db, "personalisation");

    var q = query(persRef, where("userId", "==", userId));

    var user = await getDocs(q).then(getData);

    if (user) {
        return await updateDoc(doc(persRef, user[0].id), {
            ...data
        })
    } else {
        return await addDoc(persRef, {
            ...data,
            userId
        })
    }

}


// utils

function getData(snapshot) {
    return !snapshot.empty ? snapshot.docs.map(d => ({ id: d.id, ...d.data() })) : null
}

async function getOrgId(orgName) {
    var q = query(collection(db, "orgs"), where("name", "==", orgName));
    var org = await getDocs(q).then(getData);
    return org[0] && org[0] ?.id;
}