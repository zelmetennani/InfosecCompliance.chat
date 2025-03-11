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
  
  console.log("Firebase config loaded");
  
  // Initialize Firebase immediately when the script loads
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof firebase !== 'undefined') {
      // Initialize Firebase
      firebase.initializeApp(window.firebaseConfig);
      console.log("Firebase initialized directly");
      
      // Dispatch event to notify that Firebase is ready
      document.dispatchEvent(new Event('firebaseReady'));
    } else {
      console.error("Firebase SDK not available");
    }
  });
})(); 