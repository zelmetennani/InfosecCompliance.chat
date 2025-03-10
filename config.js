// Check if we're in a local development environment
const isLocalDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';

// Function to load Firebase config
async function loadFirebaseConfig() {
  if (isLocalDevelopment) {
    try {
      // For local development, try to load from .env.js
      const envModule = await import('./env.js');
      window.firebaseConfig = envModule.default;
      console.log("Loaded Firebase config from env.js (local development)");
    } catch (error) {
      console.error("Error loading local config:", error);
      // Fallback to placeholders for GitHub Actions to replace
      window.firebaseConfig = {
        apiKey: "##FIREBASE_API_KEY##",
        authDomain: "##FIREBASE_AUTH_DOMAIN##",
        projectId: "##FIREBASE_PROJECT_ID##",
        storageBucket: "##FIREBASE_STORAGE_BUCKET##",
        messagingSenderId: "##FIREBASE_MESSAGING_SENDER_ID##",
        appId: "##FIREBASE_APP_ID##"
      };
    }
  } else {
    // For production, use placeholders that GitHub Actions will replace
    window.firebaseConfig = {
      apiKey: "##FIREBASE_API_KEY##",
      authDomain: "##FIREBASE_AUTH_DOMAIN##",
      projectId: "##FIREBASE_PROJECT_ID##",
      storageBucket: "##FIREBASE_STORAGE_BUCKET##",
      messagingSenderId: "##FIREBASE_MESSAGING_SENDER_ID##",
      appId: "##FIREBASE_APP_ID##"
    };
  }
  
  // Dispatch event to notify that Firebase config is ready
  document.dispatchEvent(new Event('firebaseConfigReady'));
}

// Load the config
loadFirebaseConfig(); 