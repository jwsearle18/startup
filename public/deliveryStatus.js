document.addEventListener("DOMContentLoaded", function() {
    const statusMessages = [
      "Order Sent!",
      "Order Being Picked up!",
      "Order Being Stocked!",
      "Your Vacation Rental is Fully Airestocked!"
    ];
    
    let currentIndex = 0; 
    
    function updateStatus() {
      document.getElementById("status").innerText = statusMessages[currentIndex];
      
      currentIndex++;
      
      if (currentIndex < statusMessages.length) {
        setTimeout(updateStatus, 3000); 
      }
    }
    
    setTimeout(updateStatus, 1000);

// const statusMessages = [
//       "Order Sent!",
//       "Order Being Picked up!",
//       "Order Being Stocked!",
//       "Your Vacation Rental is Fully Airestocked!"
//     ];
//     let currentIndex = 0;

//     const userId = localStorage.getItem('userId');

//     const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
//     this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
//     this.socket = function() {
//       ws.send(JSON.stringify({ action: 'register', userId }));
//     };

//     ws.onmessage = function(event) {
//       const message = JSON.parse(event.data);

//       if (message.type === 'orderUpdate') {
//         currentIndex = message.statusIndex; // Update index based on the message
//         updateStatus(); // Update the status immediately
//         }
//     };

//     function updateStatus() {
//       document.getElementById('status').innerText = statusMessages[currentIndex];
      
//       if (currentIndex < statusMessages.length - 1) {
//         currentIndex++; // Prepare the next status update
//       }
//     }




    async function signOut() {
      try {
          const response = await fetch('/api/auth/logout', { method: 'DELETE' });
          if (response.ok) {
              localStorage.removeItem('userId');
              localStorage.removeItem('userAddress');
              window.location.href = 'index.html';
          } else {
              alert('Failed to sign out. Please try again.');
          }
      } catch (error) {
          console.error('Error signing out:', error);
          alert('An error occurred while trying to sign out. Please try again.');
      }
  }

  document.getElementById('signOutButton').addEventListener('click', signOut);
  });
