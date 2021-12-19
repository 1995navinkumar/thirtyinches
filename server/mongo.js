const { MongoClient } = require('mongodb');

const uri =
    process.env.NODE_ENV == "production"
        ? "mongodb+srv://thirtyinchesadmin:Stonebraker@cluster0.7g1yw.mongodb.net/demo?retryWrites=true&w=majority"
        : "mongodb://localhost:27017";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function getDB() {
    var dbname = process.env.NODE_ENV == "production" ? "app" : "demo"
    await client.connect();
    return client.db(dbname);
}

module.exports = getDB;