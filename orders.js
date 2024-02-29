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

  displayUserDetails();

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

  function signOut() {
    localStorage.removeItem('selectedAddress');
    
    window.location.href = 'index.html';
}

const signOutButton = document.getElementById('signOutButton');
signOutButton.addEventListener('click', signOut);
});