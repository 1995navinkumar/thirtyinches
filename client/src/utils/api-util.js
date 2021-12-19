import { getIdToken, getUserId } from './auth-util';

function _throw(er) {
    throw er;
}

async function fetchData(url, options = {}) {
    var jwt = await getIdToken();

    var defaultOptions = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    }

    if (process.env.NODE_ENV == "development") {
        defaultOptions.headers.uid = await getUserId();
    }

    return fetch(
        url,
        {
            ...defaultOptions,
            ...options,
        }
    )
        .then(res => res.ok ? res.json() : _throw(res))
        .catch(err => console.log(err));
}

export async function createBranch(orgName, branchDetails) {
    return fetchData(
        "api/orgs/create-branch",
        {
            method: "POST",
            body: JSON.stringify({
                orgName,
                branchDetails
            })
        }
    )
}

export async function getOrgDetails(userId) {
    const db = getFirestore();

    var q = query(collection(db, "userPrivileges"), where("userId", "==", userId));

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

export async function addSubscription(orgName, branchName, subscriberDetail, subscriptionDetail) {
    return fetchData(
        "api/subscriptions/add",
        {
            method: "POST",
            body: JSON.stringify({
                subscriptionDetail,
                subscriberDetail,
                orgName,
                branchName
            })
        }
    );
}

export async function getAllSubscribers(orgName, branchNames) {
    var db = getFirestore();
    var q = query(collection(db, "subscribers"), where("orgName", "==", orgName), where("branchName", "in", branchNames));
    return await getDocs(q).then(getData);
}


// Privileges

export async function addPrivilege(p) {
    return fetchData(
        "api/userprivilege/add",
        {
            method: "POST",
            body: JSON.stringify({
                ...p
            })
        }
    )
}

export async function addDefaultRoles(roles) {
    return fetchData(
        "api/roles/populate",
        {
            method: "POST",
            body: JSON.stringify({ roles })
        }
    )
}

export async function addRole(orgName, role) {
    return fetchData(
        "api/orgs/addRole",
        {
            method: "POST",
            body: JSON.stringify({
                orgName,
                role
            })
        }
    )
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


// expense

export async function addExpense(orgName, branchName, expenseDetail) {
    return fetchData(
        "api/expenses/add",
        {
            method: "POST",
            body: JSON.stringify({
                orgName,
                branchName,
                expenseDetail
            })
        }
    )

}

export async function getAllExpense(orgName) {
    var db = getFirestore();
    var expenseRef = collection(db, "expenses");
    var q = query(expenseRef, where("orgName", "==", orgName));

    return getDocs(q).then(getData);
}

// asset

export async function addAsset(orgName, branchName, assetDetail) {
    return fetchData(
        "api/assets/add",
        {
            method: "POST",
            body: JSON.stringify({
                orgName,
                branchName,
                assetDetail
            })
        }

    )
}

export async function getAllAssets(orgName) {
    var db = getFirestore();
    var assetsRef = collection(db, "assets");
    var q = query(assetsRef, where("orgName", "==", orgName));

    return getDocs(q).then(getData);
}

// attendance

export async function markAttendance(orgName, branchName, contact, timestamp) {
    return fetchData(
        "api/attendance/add",
        {
            method: "POST",
            body: JSON.stringify({
                orgName,
                branchName,
                contact,
                timestamp
            })
        }
    );
}



// utils

function getData(snapshot) {
    return !snapshot.empty ? snapshot.docs.map(d => ({ id: d.id, ...d.data() })) : null
}

async function getOrgId(orgName) {
    var q = query(collection(db, "orgs"), where("name", "==", orgName));
    var org = await getDocs(q).then(getData);
    return org[0] && org[0]?.id;
}