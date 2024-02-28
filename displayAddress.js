document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the saved address from localStorage
    const savedAddress = localStorage.getItem('selectedAddress');
    
    if (savedAddress) {
        // If there's an address saved, display it
        document.getElementById('displayAddress').textContent = `Address: ${savedAddress}`;
    } else {
        // If no address is saved, you can display a default message or handle it as needed
        document.getElementById('displayAddress').textContent = 'No address selected.';
    }
});