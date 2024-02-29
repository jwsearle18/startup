document.addEventListener('DOMContentLoaded', function() {
  function displayUserDetails() {
      const selectedAddress = localStorage.getItem('selectedAddress');
      if (!selectedAddress) {
          console.log("No address selected.");
          return;
      }

      const registrations = JSON.parse(localStorage.getItem("registrations")) || {};
      const userDetails = Object.values(registrations).find(reg => reg.address === selectedAddress);

      if (userDetails) {
          document.getElementById("userDetails").innerHTML = `Registered by: ${userDetails.firstname} ${userDetails.lastname}, Address: ${userDetails.address}`;
      } else {
          console.log("No registration data found for the selected address.");
      }
  }

  function displayOrders() {
      const orders = JSON.parse(localStorage.getItem("orders")) || {};
      const selectedAddress = localStorage.getItem('selectedAddress');
      const orderItemsElement = document.getElementById("orderItems");

      if (selectedAddress && orders[selectedAddress]) {
          const userOrderItems = orders[selectedAddress];
          orderItemsElement.innerHTML = '';
          userOrderItems.forEach(item => {
              const itemElement = document.createElement('p');
              itemElement.textContent = item;
              orderItemsElement.appendChild(itemElement);
          });
      } else {
          orderItemsElement.innerHTML = "<p>No current orders for this address.</p>";
      }
  }

  function simulateWebSocketData() {
    const simulatedOrderItems = [
        "Doritos",
        "Lemonade",
        "Pretzels"
    ];

    setTimeout(() => {
        const selectedAddress = localStorage.getItem('selectedAddress');
        const orders = JSON.parse(localStorage.getItem("orders")) || {};

        if (!orders[selectedAddress]) {
            orders[selectedAddress] = [];
        }

        let fullOrder = simulatedOrderItems.reduce((order, item) => {
            const quantity = Math.floor(Math.random() * 6);
            if (quantity > 0) {
                order.push(`${item}: ${quantity}`);
            }
            return order;
        }, []);

        if (fullOrder.length > 0) {
            orders[selectedAddress].push(fullOrder.join(" | "));
            localStorage.setItem("orders", JSON.stringify(orders));
            displayOrders();
        }
    }, 5000);
}
// Simulation of Websocket data

  function signOut() {
      localStorage.removeItem('selectedAddress');
      window.location.href = 'index.html';
  }

  displayUserDetails();
  displayOrders();
  simulateWebSocketData();

  const signOutButton = document.getElementById('signOutButton');
  signOutButton.addEventListener('click', signOut);
});
