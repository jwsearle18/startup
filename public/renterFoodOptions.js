document.addEventListener('DOMContentLoaded', function() {
    const savedAddress = localStorage.getItem('selectedAddress');
    
    if (savedAddress) {
        document.getElementById('displayAddress').textContent = `Address: ${savedAddress}`;
    } else {
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
    
    updateOrderDisplay();
});

function addItem(item) {
    let selectedItems = JSON.parse(localStorage.getItem('selectedFoodItems')) || [];
    selectedItems.push(item);
    localStorage.setItem('selectedFoodItems', JSON.stringify(selectedItems));
    updateOrderDisplay();
}

function updateOrderDisplay() {
    const orderItemsElement = document.getElementById('orderItems');
    orderItemsElement.innerHTML = '';

    const selectedItems = JSON.parse(localStorage.getItem('selectedFoodItems')) || [];
    const itemCounts = selectedItems.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
    }, {});

    for (const [item, count] of Object.entries(itemCounts)) {
        const itemElement = document.createElement('p');
        itemElement.textContent = `${item} x${count}`;
        itemElement.classList.add('order-item');
        orderItemsElement.appendChild(itemElement);
    }
}

document.getElementById("sendOrder").addEventListener("click", function() {
    const currentAddress = localStorage.getItem("selectedAddress");
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