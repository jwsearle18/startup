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
  
  // renter's email in localStorage
  const userId = localStorage.getItem('userId');

  // Ensure a user ID is present
  if (!userId) {
    alert('User ID not found. Please log in again.');
    return;
  }

  try {
    const response = await fetch('/api/renter/associate-address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, address, startDate, endDate })
    });

    if (response.ok) {

      localStorage.setItem('userAddress', address);
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
