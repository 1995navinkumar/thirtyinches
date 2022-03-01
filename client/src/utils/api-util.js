import { getIdToken, getUserId, isDemoMode } from './auth-util';
// -------------------------------------------------------- Dashboard & Cards ---------------------------------------

export async function getCardData(cardName, params) {
    return fetchData(
        `api/dashboard/${cardName}?${getQueryParams(params)}`
    )
}


// -------------------------------------------------------- Orgs & Branches ---------------------------------------

export async function createOrg(orgName, branchDetails) {
    return fetchData(
        "api/orgs",
        {
            method: "POST",
            body: JSON.stringify({ orgName, branchDetails })
        }
    )
}

export async function createBranch(orgName, branchDetails) {
    return fetchData(
        `api/orgs/${orgName}/branches`,
        {
            method: "POST",
            body: JSON.stringify({
                orgName,
                branchDetails
            })
        }
    )
}

export async function getBranchDetails(orgName) {
    return fetchData(
        `api/orgs/${orgName}/branches`
    )
}

export async function getOrgDetails() {
    return fetchData(
        `api/orgs`
    )
}


// ---------------------------------------------------- Subscribers -----------------------------------------

export async function addNewSubscription(orgName, branchName, subscriberDetail, subscriptionDetail) {
    return fetchData(
        `api/subscribers/${orgName}`,
        {
            method: "POST",
            body: JSON.stringify({
                branchName,
                subscriberDetail
            })
        }
    )
}

export async function addSubscription(orgName, contact, subscriptionDetail) {
    return fetchData(
        `api/subscribers/${orgName}/${contact}/subscriptions`,
        {
            method: "POST",
            body: JSON.stringify({
                subscriptionDetail
            })
        }
    );
}

export async function getAllSubscribers(orgName) {
    return fetchData(
        `api/subscribers/${orgName}`
    )
}


// -------------------------------------------------------- Privileges ---------------------------------------

export async function getUserPrivileges() {
    return fetchData(
        "api/userprivilege"
    )
}

export async function addPrivilege(p) {
    return fetchData(
        "api/userprivilege",
        {
            method: "POST",
            body: JSON.stringify({
                ...p
            })
        }
    )
}

// -------------------------------------------------------- roles ---------------------------------------


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
        `api/orgs/${orgName}/roles`,
        {
            method: "POST",
            body: JSON.stringify({
                role
            })
        }
    )
}

// -------------------------------------------------------- Personalisation ---------------------------------------


export async function addPersonalisedData(data) {
    return fetchData(
        "api/personalisation",
        {
            method: "PUT",
            body: JSON.stringify({ data })
        }
    )
}

export async function getPersonalisedData() {
    return fetchData("api/personalisation");
}


// -------------------------------------------------------- expense ---------------------------------------

export async function addExpense(orgName, branchName, expenseDetail) {
    return fetchData(
        `api/expenses/${orgName}`,
        {
            method: "POST",
            body: JSON.stringify({
                branchName,
                expenseDetail
            })
        }
    )

}

export async function getAllExpense(orgName) {
    return fetchData(
        `api/expenses/${orgName}`
    )
}

// --------------------------------------------------------- asset ---------------------------------------

export async function addAsset(orgName, assetDetail) {
    return fetchData(
        `api/assets/${orgName}`,
        {
            method: "POST",
            body: JSON.stringify({
                assetDetail
            })
        }
    )
}

export async function getAllAssets(orgName) {
    return fetchData(
        `api/assets/${orgName}`
    )
}

// -------------------------------------------------------- attendance ------------------------------------------

export async function markAttendance(orgName, branchName, contact, timestamp) {
    return fetchData(
        `api/attendance/${orgName}/${contact}`,
        {
            method: "POST",
            body: JSON.stringify({
                branchName,
                timestamp
            })
        }
    );
}

//------------------------------------------------------------ utils --------------------------------------

function _throw(er) {
    er.json()
        .then(msg => msg)
        .catch(msg => {
            throw new Error(msg);
        })
}

function getQueryParams(params = {}) {
    return (new URLSearchParams(params)).toString();
}

export async function fetchData(url, options = {}) {
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

    if (isDemoMode()) {
        defaultOptions.headers.demomode = "true";
    }

    return fetch(
        url,
        {
            ...defaultOptions,
            ...options,
        }
    )
        .then(res => {
            return res.json()
                .then(data => {
                    if (res.ok) {
                        return data;
                    } else {
                        throw data;
                    }
                })
        })
}