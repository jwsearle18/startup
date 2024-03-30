document.addEventListener("DOMContentLoaded", function() {
    const signInForm = document.getElementById("signInForm");

    signInForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent the form from submitting in the traditional way

        const email = document.getElementById("email").value;
        const password = document.getElementById("psw").value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // If sign-in is successful, you might want to store the returned token or user ID in local storage
                const data = await response.json();
                localStorage.setItem('userId', data.userId);
                if (data.userAddress) {
                    localStorage.setItem('userAddress', data.userAddress); // Store user address if present
                }
                const redirectTo = data.role === 'owner' ? 'orders.html' : 'renterFoodOptions.html';
                window.location.href = redirectTo;
            } else {
                // Handle failed sign-in attempts
                const errorText = await response.text();
                alert('Sign-in failed: ' + errorText);
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
            alert('An error occurred during sign-in. Please try again.');
        }
    });
});
