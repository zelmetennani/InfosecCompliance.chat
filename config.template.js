// Firebase configuration template - environment variables will be replaced during build
(function() {
  // Set the Firebase configuration
  window.firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };
  
  // Check if config is valid
  const isConfigValid = window.firebaseConfig.apiKey && 
                       window.firebaseConfig.apiKey !== 'undefined' && 
                       window.firebaseConfig.apiKey !== '';
  
  if (!isConfigValid) {
    console.error("Firebase configuration is invalid or missing API key");
    document.dispatchEvent(new CustomEvent('firebaseConfigError', { 
      detail: { message: "Invalid Firebase configuration" } 
    }));
    return;
  }
  
  // Initialize Firebase when the DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof firebase !== 'undefined') {
      try {
        // Initialize Firebase
        firebase.initializeApp(window.firebaseConfig);
        
        // Log initialization (without revealing full key)
        const maskedConfig = {
          apiKey: window.firebaseConfig.apiKey.substring(0, 4) + "..." + 
                 window.firebaseConfig.apiKey.substring(window.firebaseConfig.apiKey.length - 4),
          authDomain: window.firebaseConfig.authDomain,
          projectId: window.firebaseConfig.projectId
        };
        console.log("Firebase initialized with config:", maskedConfig);
        
        // Dispatch event to notify that Firebase is ready
        document.dispatchEvent(new Event('firebaseReady'));
      } catch (error) {
        console.error("Error initializing Firebase:", error);
        document.dispatchEvent(new CustomEvent('firebaseConfigError', { 
          detail: { message: error.message } 
        }));
      }
    } else {
      console.error("Firebase SDK not available");
      document.dispatchEvent(new CustomEvent('firebaseConfigError', { 
        detail: { message: "Firebase SDK not loaded" } 
      }));
    }
  });
})(); 