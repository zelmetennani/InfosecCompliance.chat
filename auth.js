// auth.js - Shared authentication functionality
(function() {
    // Track if a popup is already open
    let isAuthPopupOpen = false;
    
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
        // Prevent multiple popups
        if (isAuthPopupOpen) {
            console.log("Auth popup already open, ignoring request");
            return;
        }
        
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
        
        // Set popup flag
        isAuthPopupOpen = true;
        
        // Set persistence to LOCAL for better cross-domain support
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                console.log("Firebase persistence set to LOCAL for Google sign-in");
                // Sign in with popup
                return firebase.auth().signInWithPopup(provider);
            })
            .then((result) => {
                isAuthPopupOpen = false;
                console.log("Successfully signed in with Google");
                
                if (onSuccess) {
                    onSuccess();
                } else {
                    // Add a delay before redirecting to ensure auth state is properly saved
                    setTimeout(() => {
                        console.log("Redirecting to app after delay");
                        window.location.href = "https://app.infoseccompliance.chat/";
                    }, 1000);
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