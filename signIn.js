document.addEventListener("DOMContentLoaded", function() {
    const signInButton = document.querySelector("button[onclick='signIn()']");

    function signIn() {
        const email = document.getElementsByName("email")[0].value;
        const password = document.getElementsByName("psw")[0].value;
        const address = document.getElementsByName("address")[0].value;

        // Retrieve existing registrations from localStorage
        const existingData = localStorage.getItem("registrations");
        const registrations = existingData ? JSON.parse(existingData) : {};

        // Check if the user with the given address exists
        if (registrations[address]) {
            // Verify email and password
            if (registrations[address].email === email && registrations[address].password === password) {
                // Update selectedAddress in localStorage
                localStorage.setItem("selectedAddress", address);
                // Redirect to orders.html if credentials match
                window.location.href = "orders.html";
            } else {
                // Credentials do not match
                alert("Incorrect email or password. Please try again.");
            }
        } else {
            // No registration found for the given address
            alert("No registration found for the given address. Please check your details and try again.");
        }
    }

    // Attach the signIn function to the button click event dynamically
    signInButton.addEventListener("click", signIn);
});