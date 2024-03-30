let autocomplete;

function initAutocomplete() {
    // Ensure this function can safely run multiple times by removing any existing autocomplete instance if needed
    if (window.autocomplete) {
        google.maps.event.clearInstanceListeners(window.autocomplete);
    }

    const addressInput = document.getElementById('vacationRentalAddress');
    if (addressInput) {
        window.autocomplete = new google.maps.places.Autocomplete(addressInput, { types: ['geocode'] });
        window.autocomplete.setFields(['address_components', 'geometry', 'name']);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registrationForm");
    const roleSelector = document.getElementById("role");

    roleSelector.addEventListener("change", function() {
        toggleAddressField(this.value);
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const role = form.role.value;
        const email = form.email.value;
        const password = form.password.value;
        let address = null;

        if (role === "owner") {
            address = document.getElementById('vacationRentalAddress')?.value || "";
        }

        registerUser(role, email, password, address);
    });
});

function toggleAddressField(role) {
    let addressInput = document.getElementById('vacationRentalAddress');
    
    if (role === "owner" && !addressInput) {
        const addressContainer = document.createElement("div");
        addressContainer.className = "input-container";
        addressContainer.innerHTML = `
            <label for="vacationRentalAddress"><b>Address</b></label>
            <input type="text" id="vacationRentalAddress" name="vacationRentalAddress" placeholder="Enter Vacation Rental Address" required>
        `;
        const submitButton = document.querySelector("form button[type='submit']");
        submitButton.before(addressContainer);

        initAutocomplete();
    } else if (role !== "owner" && addressInput) {
        addressInput.parentNode.remove();
    }
}

async function registerUser(role, email, password, address = null) {
    // Adjust the endpoint based on role
    const endpoint = role === 'owner' ? '/api/register/owner' : '/api/register/renter';
    const payload = { email, password };
    if (role === 'owner') {
        payload.address = address
        localStorage.setItem('userAddress', address);
    }
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      if (response.ok) {
        // Store the user's _id in localStorage for later use
        localStorage.setItem('userId', data.userId);
        
        // Redirect based on role
        const redirectTo = role === 'owner' ? 'orders.html' : 'address.html';
        window.location.href = redirectTo;
      } else {
        alert('Registration failed: ' + data.message);
      }
    } catch (error) {
      alert('Error during registration: ' + error.message);
    }
  }
  

initAutocomplete();