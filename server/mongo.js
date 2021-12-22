const { MongoClient } = require('mongodb');

const uri =
    process.env.DB == "production"
        ? "mongodb+srv://thirtyinchesadmin:Stonebraker@cluster0.7g1yw.mongodb.net/demo?retryWrites=true&w=majority"
        : "mongodb://localhost:27017";

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function getDB(dbname = "app") {
    await client.connect();
    return client.db(dbname);
}

module.exports = getDB;