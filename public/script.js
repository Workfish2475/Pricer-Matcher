// Samples
const products = [
  {
    id: 1,
    name: 'Product 1',
    price: 19.99,
  },
  {
    id: 2,
    name: 'Product 2',
    price: 29.99,
  },
  {
    id: 3,
    name: 'Product 3',
    price: 39.99,
  },
];

//display products on the webpage
function displayProducts(productList) {
  const productListDiv = document.getElementById('product-list');
  productListDiv.innerHTML = ''; 

  productList.forEach((product) => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';

    const productName = document.createElement('h2');
    productName.textContent = product.name;

    const productPrice = document.createElement('p');
    productPrice.textContent = `Price: $${product.price.toFixed(2)}`;

    const addToCartButton = document.createElement('button');
    addToCartButton.className = 'add-to-cart';
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.onclick = () => addToCart(product);

    const addToWishlistButton = document.createElement('button');
    addToWishlistButton.className = 'add-to-wishlist';
    addToWishlistButton.textContent = 'Add to Wishlist';
    addToWishlistButton.onclick = () => addToWishlist(product);

    productDiv.appendChild(productName);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(addToCartButton);
    productDiv.appendChild(addToWishlistButton);

    productListDiv.appendChild(productDiv);
  });
}

//adding products to the cart
function addToCart(product) {
  fetch('/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
  })
  .then(response => response.text())  // assume response is a text message
  .then(message => {
      console.log(message);
      alert(message);  // display browser alert dialog to inform user
  })
  .catch(error => {
      console.error('error:', error);
      alert(`failed to add ${product.name} to cart`);
  });
}

//adding products to the wishlist
function addToWishlist(product) {
  fetch('/wishlist/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
  })
  .then(response => response.text())
  .then(message => {
      console.log(message);
      alert(message);
  })
  .catch(error => {
      console.error('error:', error);
      alert(`failed to add ${product.name} to wishlist`);
  });
}

//product search
function searchProducts() {
  const searchBar = document.getElementById('search-bar');
  const query = searchBar.value.toLowerCase();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );

  displayProducts(filteredProducts);
}

document.getElementById('search-button').addEventListener('click', searchProducts);
window.onload = () => displayProducts(products);
