// auth.js - Shared authentication functionality
(function() {
    // Initialize Firebase when ready
    document.addEventListener('DOMContentLoaded', function() {
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            console.error("Firebase SDK is not loaded!");
            document.dispatchEvent(new CustomEvent('firebaseConfigError', { 
                detail: { message: "Firebase SDK not available" } 
            }));
            return;
        }
        
        // Check if Firebase config is valid
        if (!window.firebaseConfig || !window.firebaseConfig.apiKey) {
            console.error("Firebase configuration is missing or invalid");
            document.dispatchEvent(new CustomEvent('firebaseConfigError', { 
                detail: { message: "Invalid Firebase configuration" } 
            }));
            return;
        }
        
        try {
            // Initialize Firebase
            firebase.initializeApp(window.firebaseConfig);
            console.log("Firebase initialized successfully");
            
            // Dispatch event to notify that Firebase is ready
            document.dispatchEvent(new Event('firebaseReady'));
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            document.dispatchEvent(new CustomEvent('firebaseConfigError', { 
                detail: { message: error.message } 
            }));
        }
    });
    
    // Common error handler for Firebase configuration issues
    document.addEventListener('firebaseConfigError', function(event) {
        console.error("Firebase configuration error:", event.detail.message);
        
        // Show a user-friendly error message
        const authSection = document.querySelector('.auth-section');
        if (authSection) {
            authSection.innerHTML = `
                <div class="error-container" style="text-align: center; padding: 2rem; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 0.25rem;">
                    <h3>Authentication Temporarily Unavailable</h3>
                    <p>We're experiencing technical difficulties with our authentication service.</p>
                    <p>Please try again later or contact support if the problem persists.</p>
                    <p><a href="mailto:support@infoseccompliance.chat" style="color: #721c24; text-decoration: underline;">Contact Support</a></p>
                </div>
            `;
        }
    });
    
    // Helper function for Google Sign In
    window.signInWithGoogle = function(onSuccess, onError) {
        // Show loading state
        const googleButton = document.querySelector('.google-button');
        if (googleButton) {
            googleButton.disabled = true;
            googleButton.innerHTML = '<div class="spinner"></div> Connecting...';
        }
        
        // Create a new instance of the Google provider
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.setCustomParameters({
            'prompt': 'select_account'
        });
        
        // Set a flag in localStorage to indicate we just logged in
        localStorage.setItem('justLoggedIn', 'true');
        
        // Sign in with popup
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                return result.user.getIdToken(true);
            })
            .then((idToken) => {
                localStorage.setItem('authToken', idToken);
                if (onSuccess) onSuccess(idToken);
                else window.location.href = "https://app.infoseccompliance.chat/";
            })
            .catch((error) => {
                console.error("Error with Google sign-in:", error);
                if (onError) onError(error);
                else alert("Error signing in with Google: " + error.message);
                
                // Clear the flag if login failed
                localStorage.removeItem('justLoggedIn');
                
                // Reset button
                if (googleButton) {
                    googleButton.disabled = false;
                    googleButton.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" class="google-icon">Sign in with Google';
                }
            });
    };
})(); 