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
            registerOwner(email, password, address);
        } else {
            registerRenter(email, password);
        }
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

async function registerOwner(email, password, address) {
    try {
        const response = await fetch('/api/register/owner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, address }),
        });

        if (response.ok) {
            window.location.href = "orders.html";
        } else {
            console.error('Error registering owner');
            // Handle errors, e.g., show a message to the user
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
}

async function registerRenter(email, password) {
    try {
        const response = await fetch('/api/register/renter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            window.location.href = "address.html"; // Assuming this page will handle address association for renters
        } else {
            console.error('Error registering renter');
            // Handle errors, e.g., show a message to the user
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
}

initAutocomplete();