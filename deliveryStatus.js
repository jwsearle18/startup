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
  });
  // Future Websocket data