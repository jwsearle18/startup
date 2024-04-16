// document.addEventListener('DOMContentLoaded', function() {
//   const savedAddress = localStorage.getItem('userAddress');
    
//     if (savedAddress) {
//         document.getElementById('displayAddress').textContent = `${savedAddress}`;
//     } else {
//         document.getElementById('displayAddress').textContent = 'No address selected.';
//     }

//   function displayOrders() {
//     const userAddress = localStorage.getItem('userAddress');
    
//     if (userAddress) {
//       fetch(`/api/orders/${encodeURIComponent(userAddress)}`)
//           .then(response => response.json())
//           .then(orders => {
//               const orderItemsElement = document.getElementById("orderItems");
//               orderItemsElement.innerHTML = '';
//               orders.forEach(order => {
//                   const orderElement = document.createElement("div");
//                   orderElement.classList.add('order');
//                   const orderIdElement = document.createElement("p");
//                   orderIdElement.textContent = `Order ID: ${order._id}`;
//                   orderElement.appendChild(orderIdElement);
                  
//                   const orderItemsList = document.createElement("ul");
//                   order.items.forEach(item => {
//                       const itemElement = document.createElement("li");
//                       itemElement.textContent = `Item: ${item.name}, Quantity: ${item.quantity}`;
//                       orderItemsList.appendChild(itemElement);
//                   });
//                   orderElement.appendChild(orderItemsList);
//                   orderItemsElement.appendChild(orderElement);
//               });
//           })
//           .catch(error => console.error('Error fetching orders:', error));
//     } else {
//       console.log('No address. Please select an address to see orders.');
//     }
//   }


// async function signOut() {
//   try {
//     const response = await fetch('/api/auth/logout', { method: 'DELETE' });
//     if (response.ok) {
//       localStorage.removeItem('userId');
//       localStorage.removeItem('userAddress'); 

//       // Redirect to the login page or home page
//       window.location.href = 'index.html';
//     } else {
//       alert('Failed to sign out. Please try again.');
//     }
//   } catch (error) {
//     console.error('Error signing out:', error);
//     alert('An error occurred while trying to sign out. Please try again.');
//   }
// }

// // Add event listener for sign-out button
// document.getElementById('signOutButton').addEventListener('click', signOut);



//   displayOrders(); 
// //   simulateWebSocketData(); 

//   const signOutButton = document.getElementById('signOutButton');
//   signOutButton.addEventListener('click', signOut);
// });







document.addEventListener('DOMContentLoaded', function() {
  const userAddress = localStorage.getItem('userAddress');

 if (userAddress) {
    document.getElementById('displayAddress').textContent = `${userAddress}`;
} else {
    document.getElementById('displayAddress').textContent = 'No address selected.';
}
  
function displayOrders() {
  const userAddress = localStorage.getItem('userAddress');

if (userAddress) {
  fetch(`/api/orders/${encodeURIComponent(userAddress)}`)
    .then(response => {
      if (!response.ok) {
        // If the response status code is not in the 200 range, throw an error.
        throw new Error(`Failed to fetch orders, status: ${response.status}`);
      }
      return response.json();
    })
    .then(orders => {
      if (!Array.isArray(orders)) {
        // If the orders variable is not an array, throw an error.
        throw new Error('Invalid orders data');
      }
      const orderItemsElement = document.getElementById("orderItems");
      orderItemsElement.innerHTML = '';
      orders.forEach(order => {
        const orderElement = document.createElement("div");
        orderElement.classList.add('order');
        
        const orderIdElement = document.createElement("p");
        orderIdElement.textContent = `Order ID: ${order._id}`;
        orderElement.appendChild(orderIdElement);
        
        const orderItemsList = document.createElement("ul");
        order.items.forEach(item => {
          const itemElement = document.createElement("li");
          itemElement.textContent = `Item: ${item.name}, Quantity: ${item.quantity}`;
          orderItemsList.appendChild(itemElement);
        });
        orderElement.appendChild(orderItemsList);
        orderItemsElement.appendChild(orderElement);
      });
    })
    .catch(error => {
      console.error('Error fetching orders:', error);
      // Handle displaying the error to the user, possibly showing a message on the page.
      alert('An error occurred while fetching orders. Please try again later.');
    });
} else {
  console.log('No address. Please select an address to see orders.');
  // Handle the case where there is no address to show a message on the page.
  alert('No address selected. Please select an address to see orders.');
}
}

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



  displayOrders(); 
//   simulateWebSocketData(); 

  const signOutButton = document.getElementById('signOutButton');
  signOutButton.addEventListener('click', signOut);
});