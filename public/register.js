let autocomplete;

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('vacationRentalAddress'), {types: ['geocode']}
    );

    autocomplete.setFields(['address_components', 'geometry', 'name']);
}

document.addEventListener("DOMContentLoaded", function() {
    initAutocomplete();

    const form = document.getElementById("addressForm");
    const registerButton = form.querySelector("button[type='button']");

    async function validateAddress(address) {
        // Placeholder for address validation logic
        return true;
    }

    function saveToLocalStorage(data) {
        const uniqueID = data.address;

        const existingData = localStorage.getItem("registrations");
        const registrations = existingData ? JSON.parse(existingData) : {};

        registrations[uniqueID] = data;

        localStorage.setItem("registrations", JSON.stringify(registrations));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const firstname = document.getElementsByName("firstname")[0].value;
        const lastname = document.getElementsByName("lastname")[0].value;
        const email = document.getElementsByName("email")[0].value;
        const password = document.getElementsByName("password")[0].value;
        const place = autocomplete.getPlace();

        if (!place || !place.geometry) {
            alert("No details available for input: '" + place.name + "'");
            return;
        }

        const address = place.address_components.map(component => component.long_name).join(', ');

        const isValidAddress = await validateAddress(address);

        if (!isValidAddress) {
            alert("The address entered is not valid. Please try again.");
            return;
        }

        const registrationData = { firstname, lastname, email, password, address };

        saveToLocalStorage(registrationData);

        localStorage.setItem("selectedAddress", address);

        localStorage.removeItem("selectedFoodItems");

        window.location.href = "orders.html";
    }

    registerButton.addEventListener("click", handleSubmit);
});
