document.addEventListener("DOMContentLoaded", function() {
    

  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

  socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    displayOrderNotification(message);
};

function displayOrderNotification(message) {
    const notificationElement = document.createElement('p');
    notificationElement.textContent = message;
    notificationElement.className = 'order-notification';
    document.body.appendChild(notificationElement);
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
