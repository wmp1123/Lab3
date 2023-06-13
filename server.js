const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://weemaophin:!Aa00045678@lab7.hrywyik.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt')
const saltRounds = 5

app.use(express.json());

app.get('/',(req,res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


async function run() {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return "done."

  }

run()
    .then(console.log)
    .catch(console.error)

app.post('/Create', async (req,res) => {
    req.body.password = await encryptPassword(req.body.password)
    res.send(req.body);
    const result = await client.db("Lab3").collection("Users").insertOne(req.body);
console.log(req.body);
})

app.get('/Read', async (req, res) => {
    result = await client.db("Lab3").collection("Users").findOne({ username: req.body.username });
    if (result) {
        console.log(`Found a listing in the collection with the username '${req.body.username}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the username '${req.body.username}'`);
    }
});

app.patch('/Update', async (req, res) => {
    {
        req.body.password = await encryptPassword(req.body.password)
        result = await client.db("Lab3").collection("Users").updateOne({ username: req.body.username }, { $set: {password:req.body.password} });
        res.send(req.body)
        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
});

app.delete('/delete', async (req, res) => {
    let data = req.body;
    result = await client.db("Lab3").collection("Users").deleteOne({ username: req.body.username });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
    res.send(req.body.username);
});

async function encryptPassword(password) {
    const hash = await bcrypt.hash(password, saltRounds);  
    return hash
  }
