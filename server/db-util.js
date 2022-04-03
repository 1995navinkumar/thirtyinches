async function getUsersWithPrivilege(db, orgName, branches) {
    return db.collection("userPrivileges")
        .find({
            orgName,
            branches: { $in: branches }
        })
        .toArray()
}

async function getPushSubscriptionsForUsers(db, users = []) {
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