const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Welcome !!!!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eoyrd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carshop");
    const carCollection = database.collection("cars");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");

    //getcar
    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find({});
      const cars = await cursor.toArray();
      res.send(cars);
    });
    //car delete from manage car
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      res.json(result);
    });
    //post users
    app.post("/users", async (req, res) => {
      const result = await usersCollection.insertOne(req.body);
      console.log(result);
      res.json(result);
    });
    //get details
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const car = await carCollection.findOne(query);
      res.json(car);
    });

    //get allorder
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
    //get my orders
    app.get("/orders/:email", async (req, res) => {
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    //delete orders
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
    // post order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      console.log("orders", order);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//listen
app.listen(port, () => {
  console.log("Server is running", port);
});
