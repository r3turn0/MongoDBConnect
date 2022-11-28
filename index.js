const path = require('path');
require('dotenv').config({path: path.resolve(__dirname + '\\.env')});
console.log({path: path.resolve(__dirname + '\\.env')});
const mongodb = require('mongodb');

const connStr = process.env.CONNECTION_STRING;
console.log("Connection string: ", connStr);

async function main() {
    const client = new mongodb.MongoClient(connStr);
    try {
        await client.connect();
        const db = await client.db("test");
        console.log("Database: ", db.databaseName);
        const rc = await db.collection("random");
        console.log("Collection: ", rc.collectionName);
        await rc.insertOne({message: "Hello from MongoClient"})
        .then(function (result) {
            console.log(result);
        }).catch(err => console.log(err));
        console.log("Looking for messages ...")
        var query = {"message": /^Hello/};
        const mgs = await rc.find(query).toArray();
        console.log(mgs);
    }
    catch(err) {
        console.log(err);
    }
    finally {
        await client.close();
    }
}

main().catch(err => console.log(err));