// let mockDatabase = [];
// let autocomplete; 

// function initAutocomplete() {
//   autocomplete = new google.maps.places.Autocomplete(
//       document.getElementById('autocomplete'), {types: ['geocode']}
//   );

//   autocomplete.setFields(['address_components', 'geometry', 'name']);
// }

// function selectAddress() {
//   const place = autocomplete.getPlace();

//   if (!place.geometry) {
//       document.getElementById('autocomplete').placeholder = 'Enter an address';
//   } else {
//       let address = place.address_components.map(component => component.long_name).join(', ');
      
//       sessionStorage.setItem('selectedAddress', address);
      
//       console.log('Address selected:', address);
//   }
// }

// function redirectToNextPage() {
//   const address = sessionStorage.getItem('selectedAddress');
//   if (address) {
//       window.location.href = 'renterFoodOptions.html';
//   } else {
//       console.log('No address selected. Please select an address before proceeding.');
//   }
// }

// document.addEventListener('DOMContentLoaded', function() {
//   initAutocomplete(); 

//   document.getElementById('selectButton').addEventListener('click', function() {
//     selectAddress(); 

//     setTimeout(function() {
//       redirectToNextPage();
//     }, 500);
//   });

//   const selectedAddress = sessionStorage.getItem('selectedAddress');
//   if (selectedAddress) {
//       console.log('Previously selected address:', selectedAddress);
//   }
// });

let autocomplete;

// Initialize Google Maps Autocomplete
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete'), { types: ['geocode'] }
  );
  autocomplete.setFields(['address_components', 'geometry', 'name']);
}

// Function to handle form submission
async function handleSubmit(event) {
  event.preventDefault();

  const place = autocomplete.getPlace();
  if (!place.geometry) {
    alert('No details available for input: ' + place.name);
    return;
  }

  const address = place.address_components.map(component => component.long_name).join(', ');
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  
  // Assuming you've stored the renter's email in localStorage/sessionStorage or have another way to retrieve it
  const email = localStorage.getItem('renterEmail');

  try {
    const response = await fetch('/api/renter/associate-address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, address, startDate, endDate })
    });

    if (response.ok) {
      // Redirect to renterFoodOptions.html upon successful address association
      window.location.href = 'renterFoodOptions.html';
    } else {
      const errorText = await response.text();
      alert('Failed to associate address: ' + errorText);
    }
  } catch (error) {
    alert('Error submitting address: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  initAutocomplete();
  document.getElementById('submitAddress').addEventListener('click', handleSubmit);
});
