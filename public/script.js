//display products on the webpage


function displayProducts(productList) {

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
  const searchBar = document.getElementById('search-bar');
  const query = encodeURIComponent(searchBar.value.trim()); 

  const productListDiv = document.getElementById('product-list');
  productListDiv.innerHTML = '';

  fetch(`/search?itemName=${encodeURIComponent(query)}`)

  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })

  .then(data => {
      if (data) {
          displayProducts(data);
      } else {
          alert('No data found');
      }
  })

  .catch(error => {
      console.error("Error: ", error);
      alert('Failed to fetch data: ' + error.message);
  });
};



//document.getElementById('search-button').addEventListener('click', searchProducts);
document.getElementById('search-bar').addEventListener('input', searchProducts);
window.onload = async () => {
  const response = await fetch('/products'); 
  const products = await response.json();
  displayProducts(products);
};
