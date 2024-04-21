require('dotenv').config(); // load from .env file
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb'); // import mongo client

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI; // mongo connection string from .env
const client = new MongoClient(uri);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// connect to mongo and start server if connection is successful
client.connect()
    .then(() => {
        console.log("Connected to MongoDB");

        // ensure mongo client is available
        function dbConnect(req, res, next) {
          req.dbClient = client; // assume connection is maintained
          next();
        }
      

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        app.get('/cart', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'cart', 'index.html'));
        });

        app.get('/wishlist', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'wishlist', 'index.html'));
        });

        app.post('/cart/add', dbConnect, async (req, res) => {
            const item = req.body;
            try {
                const db = req.dbClient.db("PricerMatcher");
                const collection = db.collection("cart");
                await collection.insertOne(item);
                res.status(200).send('Item added to cart');
            } catch (error) {
                console.error("error adding to cart", error);
                res.status(500).send("error adding item to cart");
            }
        });

        app.get('/cart/items', dbConnect, async (req, res) => {
            try {
                const db = req.dbClient.db("PricerMatcher");
                const collection = db.collection("cart");
                const items = await collection.find({}).toArray();
                res.json(items);
            } catch (error) {
                console.error("error fetching cart items", error);
                res.status(500).send("failed to fetch cart items");
            }
        });

        app.post('/wishlist/add', dbConnect, async (req, res) => {
            const item = req.body;
            try {
                const db = req.dbClient.db("PricerMatcher");
                const collection = db.collection("wishlist");
                await collection.insertOne(item);
                res.status(200).send('Item added to wishlist');
            } catch (error) {
                console.error("error adding to wishlist", error);
                res.status(500).send("error adding item to wishlist");
            }
        });

        app.get('/wishlist/items', dbConnect, async (req, res) => {
            try {
                const db = req.dbClient.db("PricerMatcher");
                const collection = db.collection("wishlist");
                const items = await collection.find({}).toArray();
                res.json(items);
            } catch (error) {
                console.error("Error fetching wishlist items", error);
                res.status(500).send("Failed to fetch wishlist items");
            }
        });

        // delete an item from the cart
        app.delete('/cart/delete/:id', dbConnect, async (req, res) => {
            const itemId = req.params.id;  // get item id from request URL
            const db = req.dbClient.db("PricerMatcher");
            const collection = db.collection("cart");
            collection.deleteOne({ _id: new ObjectId(itemId) })
                .then(result => {
                    if (result.deletedCount === 1) {
                        res.status(200).json({ message: "Item successfully deleted from cart" });
                    } else {
                        res.status(404).json({ message: "Item not found in cart" });
                    }
                })
                .catch(error => res.status(500).json({ message: "Error deleting item from cart", error: error }));
        });

        // delete an item from the wishlist
        app.delete('/wishlist/delete/:id', dbConnect, async (req, res) => {
            const itemId = req.params.id;  // get item id from request URL
            const db = req.dbClient.db("PricerMatcher");
            const collection = db.collection("wishlist");
            collection.deleteOne({ _id: new ObjectId(itemId) })
                .then(result => {
                    if (result.deletedCount === 1) {
                        res.status(200).json({ message: "Item successfully deleted from wishlist" });
                    } else {
                        res.status(404).json({ message: "Item not found in wishlist" });
                    }
                })
                .catch(error => res.status(500).json({ message: "Error deleting item from wishlist", error: error }));
        });



        // start server
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    })
    .catch(err => {
        console.error("failed to connect to MongoDB", err);
        process.exit(1);
    });
