document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the saved address from localStorage
    const savedAddress = localStorage.getItem('selectedAddress');
    
    if (savedAddress) {
        // If there's an address saved, display it
        document.getElementById('displayAddress').textContent = `Address: ${savedAddress}`;
    } else {
        // If no address is saved, you can display a default message or handle it as needed
        document.getElementById('displayAddress').textContent = 'No address selected.';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const savedAddress = localStorage.getItem('selectedAddress');
    if (savedAddress) {
        document.getElementById('displayAddress').textContent = `Address: ${savedAddress}`;
    } else {
        document.getElementById('displayAddress').textContent = 'No address selected.';
    }
    
    updateOrderDisplay(); // Update order display on page load
});

function addItem(item) {
    let selectedItems = JSON.parse(localStorage.getItem('selectedFoodItems')) || [];
    selectedItems.push(item);
    localStorage.setItem('selectedFoodItems', JSON.stringify(selectedItems));
    // document.getElementById("selectedItems").innerHTML += `<p>${item}</p>`;
    updateOrderDisplay(); // Refresh the order display each time an item is added
}

function updateOrderDisplay() {
    const orderItemsElement = document.getElementById('orderItems');
    orderItemsElement.innerHTML = ''; // Clear existing items

    const selectedItems = JSON.parse(localStorage.getItem('selectedFoodItems')) || [];
    const itemCounts = selectedItems.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {});

    for (const [item, count] of Object.entries(itemCounts)) {
        const itemElement = document.createElement('p');
        itemElement.textContent = `${item} x${count}`;
        itemElement.classList.add('order-item'); // Add class for styling
        orderItemsElement.appendChild(itemElement);
    }
}


// document.getElementById("sendOrder").addEventListener("click", function() {
//     const currentAddress = localStorage.getItem("currentAddress");
//     const orders = JSON.parse(localStorage.getItem("orders")) || {};
//     orders[currentAddress] = orderItems; // Save the order items under the current address
//     localStorage.setItem("orders", JSON.stringify(orders)); // Update localStorage
//     window.location.href = "deliveryStatus.html"; // Redirect to the next page
//   });

document.getElementById("sendOrder").addEventListener("click", function() {
    const currentAddress = localStorage.getItem("selectedAddress"); // Ensure this is the correct key for the current address
    const selectedItems = JSON.parse(localStorage.getItem("selectedFoodItems")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || {};

    // Check if there are any selected items to save
    if (selectedItems.length > 0) {
        if (!orders[currentAddress]) {
            orders[currentAddress] = [];
        }

        // Append new items to the existing array for the current address
        orders[currentAddress] = orders[currentAddress].concat(selectedItems);

        localStorage.setItem("orders", JSON.stringify(orders)); // Update the orders in localStorage
        localStorage.removeItem("selectedFoodItems"); // Clear selected items after saving to orders
        window.location.href = "deliveryStatus.html"; // Redirect to the next page
    } else {
        alert("No items selected for the order.");
    }
});