// Firebase configuration template - environment variables will be replaced during build
(function() {
  // Check if we're in a local development environment
  const isLocalDevelopment = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1';

  if (isLocalDevelopment) {
    // For local development, try to load from env.js
    try {
      // This will be handled by your local setup
      import('./env.js').then(module => {
        window.firebaseConfig = module.default;
        console.log("Loaded Firebase config from env.js (local development)");
        initializeFirebase();
      }).catch(error => {
        console.error("Error loading local config:", error);
        // Fallback to empty config
        window.firebaseConfig = {};
        alert("Failed to load Firebase configuration for local development");
      });
    } catch (error) {
      console.error("Error importing env.js:", error);
    }
  } else {
    // For Netlify, environment variables are injected during build
    window.firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    };
    console.log("Using Netlify environment variables for Firebase config");
    initializeFirebase();
  }

  function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(window.firebaseConfig);
      console.log("Firebase initialized with config");
      // Dispatch event to notify that Firebase is ready
      document.dispatchEvent(new Event('firebaseReady'));
    } else {
      console.error("Firebase SDK not loaded");
      // Wait for the SDK to load
      document.addEventListener('DOMContentLoaded', function() {
        if (typeof firebase !== 'undefined') {
          firebase.initializeApp(window.firebaseConfig);
          console.log("Firebase initialized on DOMContentLoaded");
          document.dispatchEvent(new Event('firebaseReady'));
        } else {
          console.error("Firebase SDK not available even after DOMContentLoaded");
        }
      });
    }
  }
})(); 