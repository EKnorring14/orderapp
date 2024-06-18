// script.js

// Define sample product data
const products = [
    { id: 1, name: 'Burger', price: 5.99 },
    { id: 2, name: 'Soda', price: 2.99 },
    // Add more products as needed
];

// Function to retrieve cart from localStorage
function getCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
}

// Function to save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Initialize cart from localStorage
let cart = getCartFromStorage();

// Function to add item to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(item => item.id === productId);
    if (product) {
        for (let i = 0; i < quantity; i++) {
            cart.push({ ...product, orderId: generateOrderId() }); // Add orderId to each product in cart
        }
        saveCartToStorage();
        updateCartUI();
    }
}

// Function to remove item from cart
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartUI();
    }
}

// Function to update cart UI
function updateCartUI() {
    const cartContainer = document.getElementById('cart');
    if (cartContainer) {
        cartContainer.innerHTML = ''; // Clear previous cart content
        if (cart.length > 0) {
            const uniqueItems = [...new Set(cart.map(item => item.id))];
            uniqueItems.forEach(id => {
                const item = products.find(product => product.id === id);
                const quantity = cart.filter(product => product.id === id).length;

                const cartItem = document.createElement('div');
                cartItem.textContent = `${item.name} - $${item.price.toFixed(2)} x ${quantity}`;

                const increaseButton = document.createElement('button');
                increaseButton.textContent = '+';
                increaseButton.onclick = () => addToCart(item.id, 1);

                const decreaseButton = document.createElement('button');
                decreaseButton.textContent = '-';
                decreaseButton.onclick = () => removeFromCart(item.id);

                cartItem.appendChild(increaseButton);
                cartItem.appendChild(decreaseButton);
                cartContainer.appendChild(cartItem);
            });
            cartContainer.style.display = 'block';
        } else {
            cartContainer.textContent = 'Your cart is empty';
            cartContainer.style.display = 'block';
        }

        const totalPriceElement = document.getElementById('total-price');
        if (totalPriceElement) {
            const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
            totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
        }
    }
}

// Function to generate a unique order ID
function generateOrderId() {
    return Math.floor(Math.random() * 1000000);
}

// Function to place order (clears the cart and saves order history)
function placeOrder() {
    if (cart.length > 0) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            alert('You need to be logged in to place an order');
            return;
        }

        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || {};
        if (!orderHistory[loggedInUser]) {
            orderHistory[loggedInUser] = [];
        }
        orderHistory[loggedInUser].push([...cart]);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

        alert('Order placed successfully!');
        cart = [];
        saveCartToStorage();
        updateCartUI();
        goToHome();
    } else {
        alert('Your cart is empty!');
    }
}

// Function to display order history
function displayOrderHistory() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || {};
    const userOrders = orderHistory[loggedInUser] || [];

    const orderHistoryContainer = document.getElementById('order-history');
    if (orderHistoryContainer) {
        // Clear previous order history content
        orderHistoryContainer.innerHTML = '';

        if (userOrders.length > 0) {
            userOrders.forEach((order, index) => {
                const orderItem = document.createElement('div');
                orderItem.textContent = `Order ${index + 1}:`;
                order.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.textContent = `${product.name} - $${product.price.toFixed(2)}`;
                    orderItem.appendChild(productItem);
                });
                orderHistoryContainer.appendChild(orderItem);
            });
        } else {
            orderHistoryContainer.textContent = 'You have no order history';
        }
    }
}

// Call updateCartUI() and displayOrderHistory() on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    if (document.getElementById('order-history')) {
        displayOrderHistory();
    }
});


// Function to navigate back to home page
function goToHome() {
    window.location.href = 'index.html';
}

// Function to navigate to checkout page
function goToCheckout() {
    window.location.href = 'checkout.html';
}

// Function to search for products
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const results = products.filter(product => product.name.toLowerCase().includes(searchTerm));

    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = ''; // Clear previous results

    results.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.name.toLowerCase()}.jpg" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>$${product.price.toFixed(2)}</p>
            <input type="number" value="1" min="1" id="quantity-${product.id}">
            <button onclick="addToCart(${product.id}, document.getElementById('quantity-${product.id}').value)">Add to Cart</button>
        `;
        searchResultsContainer.appendChild(productCard);
    });
}

// Call updateCartUI() on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    if (document.getElementById('order-history')) {
        displayOrderHistory();
    }
});
