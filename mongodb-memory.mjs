import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

// This will create an new instance of "MongoMemoryServer" and automatically start it
const mongod = await MongoMemoryServer.create({
    instance: {
        port: 27017,
    }
});

const uri = mongod.getUri();

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function getDB(dbname = "app") {
    await client.connect();
    const db = client.db(dbname);
    await db.collection("assets")
        .insertOne({
            orgName: "navin",
            name: "dumbell"
        });

    var assets = await db.collection("assets")
        .find({
            orgName: "navin"
        })
        .toArray();

    console.log(assets);
}

await getDB();

process.exit(0);

