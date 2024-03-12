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
    }
    
};
