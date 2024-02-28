document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("addressForm");
    const registerButton = form.querySelector("button[type='button']");

    async function validateAddress(address) {
        // Placeholder for address validation logic
        return true; // Assuming the address is valid for demonstration
    }

    function saveToLocalStorage(data) {
        // Use the address as the unique ID for each registration
        const uniqueID = data.address; // Address is now the unique identifier

        // Retrieve existing data
        const existingData = localStorage.getItem("registrations");
        const registrations = existingData ? JSON.parse(existingData) : {};

        // Add the new registration data under the address
        registrations[uniqueID] = data;

        // Save back to localStorage
        localStorage.setItem("registrations", JSON.stringify(registrations));
    }

    async function handleSubmit(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const firstname = document.getElementsByName("firstname")[0].value;
        const lastname = document.getElementsByName("lastname")[0].value;
        const email = document.getElementsByName("email")[0].value;
        const password = document.getElementsByName("password")[0].value;
        const address = document.getElementById("name").value;

        // Validate the address through the API
        const isValidAddress = await validateAddress(address);

        if (!isValidAddress) {
            alert("The address entered is not valid. Please try again.");
            return;
        }

        // Prepare the data for storage
        const registrationData = { firstname, lastname, email, password, address };

        // Save the registration data to localStorage using the address as the key
        saveToLocalStorage(registrationData);

        // Update selectedAddress in localStorage
        localStorage.setItem("selectedAddress", address);

        // Optionally clear previous orders associated with different addresses
        // or handle this logic elsewhere in your application
        localStorage.removeItem("selectedFoodItems"); // Clear the food selection

        // Redirect the user to the orders.html page after successful registration
        window.location.href = "orders.html";
    }

    registerButton.addEventListener("click", handleSubmit);
});
