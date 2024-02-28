// document.addEventListener('DOMContentLoaded', function() {
//   // Function to display registration details
//   function displayUserDetails() {
//       const userDetails = getMostRecentRegistration();
//       if (!userDetails) {
//           console.log("No registration data found.");
//           return;
//       }

//       const userDetailsDiv = document.getElementById("userDetails");
//       userDetailsDiv.innerHTML = `Registered by: ${userDetails.firstname} ${userDetails.lastname}, Address: ${userDetails.address}`;
//   }

//   // Function to get the most recent registration
//   function getMostRecentRegistration() {
//       const registrations = JSON.parse(localStorage.getItem("registrations"));
//       if (!registrations) return null;

//       const keys = Object.keys(registrations);
//       const lastKey = keys[keys.length - 1];
//       return registrations[lastKey];
//   }

//   // Call to display user details
//   displayUserDetails();

//   // Retrieve stored order details
//   const orders = JSON.parse(localStorage.getItem("orders")) || {};
//   const lastRegistrationKey = Object.keys(orders).pop(); // Assuming the last key is the current session/user
//   const userAddress = getMostRecentRegistration()?.address;
//   const orderItemsElement = document.getElementById("orderItems");

//   if (userAddress && orders[userAddress]) {
//       const userOrderItems = orders[userAddress];
//       orderItemsElement.innerHTML = ''; // Clear existing contents
//       userOrderItems.forEach(item => {
//           const itemElement = document.createElement('p');
//           itemElement.textContent = item;
//           orderItemsElement.appendChild(itemElement);
//       });
//   } else {
//       orderItemsElement.innerHTML = "<p>No current orders for this address.</p>";
//   }
// });


document.addEventListener('DOMContentLoaded', function() {
  function displayUserDetails() {
      // Retrieve the current user's address
      const selectedAddress = localStorage.getItem('selectedAddress');
      if (!selectedAddress) {
          console.log("No address selected.");
          return;
      }

      // Attempt to find the registration details using the selected address
      const registrations = JSON.parse(localStorage.getItem("registrations")) || {};
      const userDetails = Object.values(registrations).find(reg => reg.address === selectedAddress);

      if (userDetails) {
          document.getElementById("userDetails").innerHTML = `Registered by: ${userDetails.firstname} ${userDetails.lastname}, Address: ${userDetails.address}`;
      } else {
          console.log("No registration data found for the selected address.");
      }
  }

  displayUserDetails();

  // Display the order related to the selected address
  const orders = JSON.parse(localStorage.getItem("orders")) || {};
  const selectedAddress = localStorage.getItem('selectedAddress');
  const orderItemsElement = document.getElementById("orderItems");

  if (selectedAddress && orders[selectedAddress]) {
      const userOrderItems = orders[selectedAddress];
      orderItemsElement.innerHTML = ''; // Clear existing contents
      userOrderItems.forEach(item => {
          const itemElement = document.createElement('p');
          itemElement.textContent = item;
          orderItemsElement.appendChild(itemElement);
      });
  } else {
      orderItemsElement.innerHTML = "<p>No current orders for this address.</p>";
  }
});