document.addEventListener('DOMContentLoaded', function() {
    const signInForm = document.getElementById('signInForm');
    
    // Initialize Firebase Auth
    const auth = firebase.auth();

    // Handle Sign In
    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            // Redirect to app after successful sign in
            window.location.href = 'https://app.infoseccompliance.chat';
            
        } catch (error) {
            console.error('Sign in error:', error);
            let errorMessage = 'Error signing in. Please try again.';
            
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            }
            
            alert(errorMessage);
        }
    });
}); 