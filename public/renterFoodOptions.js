function fetchGroceryProducts(query) {
    const url = `/api/searchGroceryProducts?query=${query}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayGroceryProducts(data.results);
        })
        .catch(error => console.error('Error fetching grocery products:', error));
}

function searchProducts() {
    const query = document.getElementById('productSearchQuery').value;
    fetchGroceryProducts(query);
}

  
function displayGroceryProducts(products) {
    const foodSelection = document.getElementById('foodSelection');
    foodSelection.innerHTML = ''; // Clear previous search results

    products.forEach(product => {
        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');

        const name = document.createElement('div');
        name.textContent = product.name;
        name.classList.add('product-name');

        const img = document.createElement('img');
        img.src = `https://spoonacular.com/cdn/ingredients_100x100/${product.image}`;
        img.alt = product.name;
        img.classList.add('product-image');

        const quantityControl = document.createElement('div');
        quantityControl.classList.add('quantity-control');

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.onclick = () => adjustQuantity(product.name, 'decrease');

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.onclick = () => adjustQuantity(product.name, 'increase');

        quantityControl.appendChild(decreaseButton);
        quantityControl.appendChild(increaseButton);

        // Adjusting the order of elements
        productContainer.appendChild(name);
        productContainer.appendChild(img);
        productContainer.appendChild(quantityControl);

        foodSelection.appendChild(productContainer);
    });
}

function adjustQuantity(productName, action) {
    let selectedItems = JSON.parse(localStorage.getItem('selectedFoodItems')) || [];
    let productIndex = selectedItems.findIndex(item => item.name === productName);

    if (productIndex !== -1) {
        if (action === 'increase') {
            selectedItems[productIndex].quantity += 1;
        } else if (action === 'decrease' && selectedItems[productIndex].quantity > 0) {
            selectedItems[productIndex].quantity -= 1;
        }
    } else if (action === 'increase') {
        selectedItems.push({ name: productName, quantity: 1 });
    }

    localStorage.setItem('selectedFoodItems', JSON.stringify(selectedItems));
    updateOrderDisplay();
}
  
function updateOrderDisplay() {
    const orderItemsElement = document.getElementById('orderItems');
    orderItemsElement.innerHTML = '';
  
    const selectedItems = JSON.parse(localStorage.getItem('selectedFoodItems')) || [];
  
    selectedItems.forEach(item => {
        const itemElement = document.createElement('p');
        itemElement.textContent = `${item.name} x${item.quantity}`;
        itemElement.classList.add('order-item');
        orderItemsElement.appendChild(itemElement);
    });
}
  
  document.addEventListener('DOMContentLoaded', function() {
    const savedAddress = sessionStorage.getItem('selectedAddress');
    
    if (savedAddress) {
        document.getElementById('displayAddress').textContent = `Address: ${savedAddress}`;
    } else {
        document.getElementById('displayAddress').textContent = 'No address selected.';
    }
    
    // displayGroceryProducts([]);
    updateOrderDisplay();

    document.getElementById("searchButton").addEventListener("click", function() {
        searchProducts();
      });
    
      // Add an event listener for the Enter key on the product search query input
      document.getElementById("productSearchQuery").addEventListener("keypress", function(event) {
        if (event.key === "Enter") { // Could also use event.keyCode === 13 for older browsers
          event.preventDefault(); // Prevent the default action to stop submitting the form
          searchProducts();
        }
      });

  });
  
  document.getElementById("sendOrder").addEventListener("click", function() {
    const currentAddress = sessionStorage.getItem("selectedAddress");
    const selectedItems = JSON.parse(localStorage.getItem("selectedFoodItems")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || {};
  
    if (selectedItems.length > 0) {
        if (!orders[currentAddress]) {
            orders[currentAddress] = [];
        }
  
        orders[currentAddress] = orders[currentAddress].concat(selectedItems);
  
        localStorage.setItem("orders", JSON.stringify(orders)); 
        localStorage.removeItem("selectedFoodItems");
        window.location.href = "deliveryStatus.html";
    } else {
        alert("No items selected for the order.");
    }
  });