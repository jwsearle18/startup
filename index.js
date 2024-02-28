let mockDatabase = [];

function selectAddress() {
    const addressInput = document.getElementById('name').value;
    
    mockDatabase.push(addressInput);

    localStorage.removeItem('selectedFoodItems');
    
    localStorage.setItem('selectedAddress', addressInput);
    
    console.log('Address selected:', addressInput);
    window.location.href = 'renterFoodOptions.html';
    
}

window.onload = function() {
    const selectedAddress = localStorage.getItem('selectedAddress');
    if (selectedAddress) {
        console.log('Previously selected address:', selectedAddress);
        // Here you can also inject the selectedAddress into the DOM if needed
    }
    
    // Mock real-time data injection (for demonstration, replace with WebSocket in production)
    mockRealtimeData();
};

// Mock function to simulate real-time data update
function mockRealtimeData() {
    setTimeout(() => {
        const mockData = { message: "Welcome to Airestock!" }; // Example real-time message
        console.log('Real-time message:', mockData.message); // For demonstration, log to console
        // In a real scenario, you would inject this into the DOM
    }, 5000); // Simulate real-time data after 5 seconds
}
