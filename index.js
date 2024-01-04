const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 2900;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sja1kis.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        const benefits = client.db("taskManagementDB").collection("benefitsDB");
        const taskerUsers = client
            .db("taskManagementDB")
            .collection("taskerUser");
        const taskData = client.db("taskManagementDB").collection("taskDataDB");
        const taskCompletedData = client
            .db("taskManagementDB")
            .collection("taskCompletedDataDB");
        const taskListDB = client.db("taskManagementDB").collection("taskList");

        // getting all taskList
        app.get("/taskList", async (req, res) => {
            const cursor = taskListDB.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/benefits", async (req, res) => {
            const cursor = benefits.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/users", async (req, res) => {
            const cursor = taskerUsers.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/taskData", async (req, res) => {
            const cursor = taskData.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/completedTaskData", async (req, res) => {
            const cursor = taskCompletedData.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post("/users", async (req, res) => {
            const usersData = req.body;
            const result = await taskerUsers.insertOne(usersData);
            res.send(result);
        });

        app.post("/completedTaskData", async (req, res) => {
            const usersData = req.body;
            const result = await taskCompletedData.insertOne(usersData);
            res.send(result);
        });

        app.post("/taskData", async (req, res) => {
            const usersData = req.body;
            const result = await taskData.insertOne(usersData);
            res.send(result);
        });

        app.delete("/taskData/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskData.deleteOne(query);
            res.send(result);
        });

        // delete completed task
        app.delete('/completedTaskData/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await taskCompletedData.deleteOne(query)
            res.send(result)
        })

        // await client.db("admin").command({ ping: 1 });
        // console.log(
        //     "Pinged your deployment. You successfully connected to MongoDB!"
        // );
    } finally {
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Task Manager is running");
});

app.listen(port, () => {
    console.log(`Task management platform is running on port ${port}`);
});
