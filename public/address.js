let mockDatabase = [];
let autocomplete; 

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'), {types: ['geocode']}
  );

  autocomplete.setFields(['address_components', 'geometry', 'name']);
}

function selectAddress() {
  const place = autocomplete.getPlace();

  if (!place.geometry) {
      document.getElementById('autocomplete').placeholder = 'Enter an address';
  } else {
      let address = place.address_components.map(component => component.long_name).join(', ');
      
      localStorage.setItem('selectedAddress', address);
      
      console.log('Address selected:', address);
  }
}

function redirectToNextPage() {
  const address = localStorage.getItem('selectedAddress');
  if (address) {
      window.location.href = 'renterFoodOptions.html';
  } else {
      console.log('No address selected. Please select an address before proceeding.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initAutocomplete(); 

  document.getElementById('selectButton').addEventListener('click', redirectToNextPage);

  const selectedAddress = localStorage.getItem('selectedAddress');
  if (selectedAddress) {
      console.log('Previously selected address:', selectedAddress);
  }
});
