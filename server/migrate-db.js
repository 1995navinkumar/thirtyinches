const getDB = require("./mongo");

async function migrate() {
    var db = await getDB("demo");

    var subscribers = await db.collection("subscribers")
        .find({})
        .toArray();


    for (let i = 0; i < subscribers.length; i++) {
        let subscriber = subscribers[i];
        await db.collection("subscribers")
            .updateOne(
                {
                    _id: subscriber._id
                },
                {
                    $set: {
                        "subscriptions.0.start": new Date(subscriber.subscriptions[0].start),
                        "subscriptions.0.end": new Date(subscriber.subscriptions[0].end),
                    }
                }
            )
        console.log(`updated ${subscriber._id}`)
    }

}

migrate().then(process.exit);