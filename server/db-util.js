async function getUsersWithPrivilege(db, orgName, branch) {
    console.log(orgName, branch);
    return db.collection("userPrivileges")
        .find({
            orgName,
            branches: branch
        })
        .toArray()
}

async function getPushSubscriptionsForUsers(db, users = []) {
    console.log(users);
    return db.collection("pushSubscription")
        .find({
            userId: { $in: [...users] }
        })
        .toArray()
}

module.exports = {
    getUsersWithPrivilege,
    getPushSubscriptionsForUsers
}