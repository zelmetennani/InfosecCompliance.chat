document.addEventListener('DOMContentLoaded', function() {
    const signUpForm = document.getElementById('signUpForm');
    const successMessage = document.getElementById('successMessage');
    
    // Initialize Firebase Auth
    const auth = firebase.auth();

    // Handle Sign Up
    signUpForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Show success message
                signUpForm.classList.add('hidden');
                successMessage.classList.remove('hidden');
            })
            .catch((error) => {
                console.error("Error signing up:", error);
                alert("Error signing up: " + error.message);
            });
    });
}); 