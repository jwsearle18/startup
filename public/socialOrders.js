document.addEventListener("DOMContentLoaded", function() {
    

  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

  socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    if (message.type === 'newOrder') {
      displayOrderNotification(message.orders);
    } 
    
};

function displayOrderNotification(orders) {
  const notificationContainer = document.getElementById('notificationContainer')
  notificationContainer.innerHTML = '';
  
  if (Array.isArray(orders)) {
    orders.forEach(order => {
      const notificationElement = document.createElement('p');
      notificationElement.textContent = order;
      notificationElement.className = 'notification';
      notificationContainer.appendChild(notificationElement);
    });
  } else { // If `orders` is a single string of order
    const notificationElement = document.createElement('p');
    notificationElement.textContent = orders;
    notificationElement.className = 'notification';
    notificationContainer.appendChild(notificationElement);
  }

}


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
