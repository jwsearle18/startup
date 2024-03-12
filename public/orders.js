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
    // Will retrieve data to display here
      const orderItemsElement = document.getElementById("orderItems");
      orderItemsElement.innerHTML = "<p>Order will be displayed here.</p>";
  }

  function simulateWebSocketData() {
    const simulatedOrderItems = [
        "Doritos",
        "Lemonade",
        "Pretzels"
    ];

    setTimeout(() => {
        let fullOrder = simulatedOrderItems.reduce((order, item) => {
            const quantity = Math.floor(Math.random() * 6);
            if (quantity > 0) {
                order.push(`${item}: ${quantity}`);
            }
            return order;
        }, []);

        
        if (fullOrder.length > 0) {
            const orderItemsElement = document.getElementById("orderItems");
            orderItemsElement.innerHTML = `${fullOrder.join(" | ")}`;
        }
    }, 5000); 
  }

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
