//display products on the webpage


function displayProducts(productList) {
  console.log(productList)
  const productListDiv = document.getElementById('product-list');
  productListDiv.innerHTML = ''; 

  productList.forEach((product) => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';

    const productName = document.createElement('h2');
    productName.textContent = product.item;

    const productPrice = document.createElement('p');
    productPrice.textContent = `Price: $${product.price.toFixed(2)}`;

    const addToCartButton = document.createElement('button');
    addToCartButton.className = 'add-to-cart';
    addToCartButton.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Add to Cart';
    addToCartButton.onclick = () => addToCart(product);

    const addToWishlistButton = document.createElement('button');
    addToWishlistButton.className = 'add-to-wishlist';
    addToWishlistButton.innerHTML = '<i class="fa-solid fa-heart"></i> Add to Wishlist';
    addToWishlistButton.onclick = () => addToWishlist(product);

    const productRetailer = document.createElement('p');
    productRetailer.textContent = `Retailer: ${product.retailer}`;

    productDiv.appendChild(productName);
    productDiv.appendChild(productRetailer);
    productDiv.appendChild(productPrice);
    productDiv.appendChild(addToCartButton);
    productDiv.appendChild(addToWishlistButton);

    productListDiv.appendChild(productDiv);
    
  });
}

// Function to display a notification message
function displayNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Automatically remove the notification after a certain duration
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000); // Adjust the duration as needed (in milliseconds)
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
      displayNotification(message);
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
      displayNotification(message)
  })
  .catch(error => {
      console.error('error:', error);
      alert(`failed to add ${product.name} to wishlist`);
  });
}

const searchProducts = async () => {
  try {
    const searchBar = document.getElementById('search-bar');
    const query = searchBar.value.toLowerCase();
    const response = await fetch(`/search?q=${query}`);
    const results = await response.json();
    
    const productListDiv = document.getElementById('product-list');
    productListDiv.innerHTML = ''; // Clear existing items before displaying search results


    displayProducts(results);

  } catch (error) {
    console.error('Error searching for products:', error);
    alert('An error occurred while searching for products. Please try again later.');
}
};


//document.getElementById('search-button').addEventListener('click', searchProducts);
document.getElementById('search-bar').addEventListener('input', searchProducts);
window.onload = async () => {
  const response = await fetch('/products'); 
  const products = await response.json();
  displayProducts(products);
};
