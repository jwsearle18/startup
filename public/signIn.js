let autocomplete;

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('vacationRentalAddress'), {types: ['geocode']}
    );

    autocomplete.setFields(['address_components', 'geometry', 'name']);
}

document.addEventListener("DOMContentLoaded", function() {
    initAutocomplete();

    const signInButton = document.getElementById("signInButton");

    signInButton.addEventListener("click", function signIn() {
        const email = document.getElementsByName("email")[0].value;
        const password = document.getElementsByName("psw")[0].value;
        // Fetch the place from the autocomplete object instead of the input value directly
        const place = autocomplete.getPlace();

        if (!place || !place.geometry) {
            alert("No details available for input: '" + place.name + "'");
            return;
        }

        const address = place.address_components.map(component => component.long_name).join(', ');

        const existingData = localStorage.getItem("registrations");
        const registrations = existingData ? JSON.parse(existingData) : {};

        // Find registration by iterating over registrations as the address format might change
        const registration = Object.values(registrations).find(reg => reg.address === address);

        if (registration) {
            if (registration.email === email && registration.password === password) {
                localStorage.setItem("selectedAddress", address);
                window.location.href = "orders.html";
            } else {
                alert("Incorrect email or password. Please try again.");
            }
        } else {
            alert("No registration found for the given address. Please check your details and try again.");
        }
    });
});
