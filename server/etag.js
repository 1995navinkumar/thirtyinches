const etag = require("etag");
const getDB = require("./mongo");


const resourceUpdateTime = {};

function getEtag(value) {
    return etag(value);
}

const eTagFilter = resourceName => async (req, res, next) => {
    var db = await getDB(req.dbname);
    var { orgName } = req.params;
    let updatedTime = await getResourceUpdateTime(db, orgName, resourceName);
    let previousETag = req.headers['if-none-match'];

    res.set("ETag", getEtag(updatedTime));

    if (!previousETag) {
        // initial request
        next();
    } else {
        if (getEtag(updatedTime) === previousETag) {
            // no change in resource
            console.log("returning same resource");
            res.status(304);
            res.end();
        } else {
            next();
        }
    }
}

const allowedResources = ["assets", "attendance", "expenses", "subscribers"];

async function getResourceUpdateTime(db, orgName, resourceName) {
    if (!allowedResources.includes(resourceName)) {
        throw "Resource not supported";
    }

    if (!(orgName in resourceUpdateTime)) {
        var doc = await db
            .collection("orgs")
            .findOne({ name: orgName });

        // console.log(doc);
        if (doc.resourceUpdateTime) {
            resourceUpdateTime[orgName] = doc.resourceUpdateTime;
        }
    }
    return resourceUpdateTime[orgName]?.[resourceName];

}

async function setResourceUpdateTime(db, orgName, resourceName) {
    if (!allowedResources.includes(resourceName)) {
        throw "Resource not supported";
    }

    let updateTime = new Date().toISOString();

    await db.collection("orgs")
        .updateOne(
            { name: orgName },
            { $set: { [`resourceUpdateTime.${resourceName}"`]: updateTime } }
        )
    return updateTime;
}

module.exports = {
    getEtag,
    getResourceUpdateTime,
    setResourceUpdateTime,
    eTagFilter
}