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
    const selectedAddress = localStorage.getItem('selectedAddress');
    
    if (selectedAddress) {
      fetch(`/api/orders/${encodeURIComponent(selectedAddress)}`)
        .then(response => response.json())
        .then(orders => {
          const orderItemsElement = document.getElementById("orderItems");
          orderItemsElement.innerHTML = '';
          orders.forEach(order => {
            const orderElement = document.createElement("p");
            orderElement.textContent = `${order.name} x${order.quantity}`;
            orderItemsElement.appendChild(orderElement);
          });
        })
        .catch(error => console.error('Error fetching orders:', error));
    } else {
      console.log('No address selected. Please select an address to see orders.');
    }
  }
  

//   function simulateWebSocketData() {
//     const simulatedOrderItems = [
//         "Doritos",
//         "Lemonade",
//         "Pretzels"
//     ];

//     setTimeout(() => {
//         let fullOrder = simulatedOrderItems.reduce((order, item) => {
//             const quantity = Math.floor(Math.random() * 6);
//             if (quantity > 0) {
//                 order.push(`${item}: ${quantity}`);
//             }
//             return order;
//         }, []);

        
//         if (fullOrder.length > 0) {
//             const orderItemsElement = document.getElementById("orderItems");
//             orderItemsElement.innerHTML = `${fullOrder.join(" | ")}`;
//         }
//     }, 5000); 
//   }

async function signOut() {
  try {
    const response = await fetch('/api/auth/logout', { method: 'DELETE' });
    if (response.ok) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userAddress'); 

      // Redirect to the login page or home page
      window.location.href = 'index.html';
    } else {
      alert('Failed to sign out. Please try again.');
    }
  } catch (error) {
    console.error('Error signing out:', error);
    alert('An error occurred while trying to sign out. Please try again.');
  }
}

// Add event listener for sign-out button
document.getElementById('signOutButton').addEventListener('click', signOut);


  displayUserDetails();
  displayOrders(); 
//   simulateWebSocketData(); 

  const signOutButton = document.getElementById('signOutButton');
  signOutButton.addEventListener('click', signOut);
});
