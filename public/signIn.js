document.addEventListener("DOMContentLoaded", function() {
    const signInButton = document.getElementById("signInButton");

    signInButton.addEventListener("click", function signIn() {
        const email = document.getElementsByName("email")[0].value;
        const password = document.getElementsByName("psw")[0].value;
        const address = document.getElementsByName("vrAddress")[0].value;

        const existingData = localStorage.getItem("registrations");
        const registrations = existingData ? JSON.parse(existingData) : {};

        if (registrations[address]) {
            if (registrations[address].email === email && registrations[address].password === password) {
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
