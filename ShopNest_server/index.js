const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { ObjectId } = require("mongodb");
const { MongoClient, ServerApiVersion } = require("mongodb");

// middleware
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    })
);
app.use(express.json());

// MongoDB client
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        console.log("✅ MongoDB Connected");

        const db = client.db("ShopNest_db");
        const IteamsCollection = db.collection("items");

        //  Add product
        app.post("/items", async (req, res) => {
            const ItemData = req.body
            const result = await IteamsCollection.insertOne(ItemData)
            res.send(result)

        })

        //  Get all products

        app.get("/items", async (req, res) => {
            const result = await IteamsCollection.find().toArray();
            res.send(result);
        });

       // server.js / items route
app.get("/items/:slug", async (req, res) => {
  const { slug } = req.params;

  // MongoDB query: slug ফিল্ড দিয়ে product খুঁজবে
  const product = await IteamsCollection.findOne({ slug });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});



    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

// ✅ run function call
run().catch(console.dir);

// root route
app.get("/", (req, res) => {
    res.send("ShopNest Server is running 🚀");
});

// listen
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
