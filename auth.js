// auth.js - Shared authentication functionality
(function() {
    // Track if a popup is already open
    let isAuthPopupOpen = false;
    
    // Set a cookie on the .infoseccompliance.chat domain to enable sharing
    document.cookie = "firebaseAuthEnabled=true; domain=.infoseccompliance.chat; path=/; SameSite=None; Secure";
    console.log("Set cross-domain cookie for authentication in auth.js");
    
    // Initialize Firebase when ready
    document.addEventListener('DOMContentLoaded', function() {
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            console.error("Firebase SDK is not loaded!");
            showAuthError("Firebase SDK not available");
            return;
        }
        
        // Check if Firebase config is valid
        if (!window.firebaseConfig || !window.firebaseConfig.apiKey || window.firebaseConfig.apiKey.includes('##')) {
            console.error("Firebase configuration is missing or invalid");
            showAuthError("Invalid Firebase configuration");
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
            showAuthError(error.message);
        }
    });
    
    // Helper function to show auth errors
    function showAuthError(message) {
        console.error("Authentication error:", message);
        
        // Show a user-friendly error message
        const authSection = document.querySelector('.auth-section');
        if (authSection) {
            authSection.innerHTML = `
                <div class="error-container" style="text-align: center; padding: 2rem; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 0.25rem;">
                    <h3>Authentication Temporarily Unavailable</h3>
                    <p>We're experiencing technical difficulties with our authentication service.</p>
                    <p>Error details: ${message}</p>
                    <p>Please try again later or contact support if the problem persists.</p>
                    <p><a href="mailto:support@infoseccompliance.chat" style="color: #721c24; text-decoration: underline;">Contact Support</a></p>
                </div>
            `;
        }
        
        // Dispatch event for other components to react
        document.dispatchEvent(new CustomEvent('firebaseConfigError', { 
            detail: { message: message } 
        }));
    }
    
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
        // Check if a popup is already open
        if (isAuthPopupOpen) {
            console.log("A sign-in popup is already open");
            return;
        }
        
        // Get the button that was clicked (if any)
        const googleButton = document.querySelector('#googleSignIn');
        if (googleButton) {
            googleButton.disabled = true;
            googleButton.innerHTML = '<div class="spinner"></div> Signing in...';
        }
        
        // Create a Google auth provider
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.setCustomParameters({
            'prompt': 'select_account'
        });
        
        // Set popup flag
        isAuthPopupOpen = true;
        
        // Set persistence to SESSION for better cross-domain support
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
                console.log("Firebase persistence set to SESSION for Google sign-in");
                // Sign in with popup
                return firebase.auth().signInWithPopup(provider);
            })
            .then((result) => {
                isAuthPopupOpen = false;
                console.log("Successfully signed in with Google");
                
                // Get the user's ID token
                return result.user.getIdToken();
            })
            .then((idToken) => {
                console.log("Got ID token, setting up cross-domain auth");
                
                // Set a cookie with the ID token
                document.cookie = `firebaseIdToken=${idToken}; domain=.infoseccompliance.chat; path=/; SameSite=None; Secure`;
                
                if (onSuccess) {
                    onSuccess(idToken);
                } else {
                    // Add a longer delay before redirecting to ensure auth state is properly saved
                    setTimeout(() => {
                        console.log("Redirecting to app after delay");
                        window.location.href = "https://app.infoseccompliance.chat/";
                    }, 2000); // Increased from 1000ms to 2000ms
                }
            })
            .catch((error) => {
                isAuthPopupOpen = false;
                console.error("Error with Google sign-in:", error);
                
                // Don't show cancelled popup errors to the user
                if (error.code !== 'auth/cancelled-popup-request' && 
                    error.code !== 'auth/popup-closed-by-user') {
                    if (onError) onError(error);
                    else alert("Error signing in with Google: " + error.message);
                } else {
                    console.log("User cancelled the popup");
                }
                
                // Reset button
                if (googleButton) {
                    googleButton.disabled = false;
                    googleButton.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" class="google-icon">Sign in with Google';
                }
            });
    };
})(); 