const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart', 'index.html'));
});

app.get('/wishlist', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wishlist', 'index.html'));
});

let cart = [];
let wishlist = [];

app.post('/cart/add', (req, res) => {
  const item = req.body;
  cart.push(item);
  res.status(200).send('Item added to cart');
});

app.get('/cart/items', (req, res) => {
  res.json(cart);
});

app.post('/wishlist/add', (req, res) => {
  const item = req.body;
  wishlist.push(item);
  res.status(200).send('Item added to wishlist');
});

app.get('/wishlist/items', (req, res) => {
  res.json(wishlist);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

