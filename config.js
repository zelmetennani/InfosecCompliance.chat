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
        apiKey: "AIzaSyALZWouXQCdO49GYYA5NTaeESVDcBHmZGs",
        authDomain: "infoseccompliance-chat.firebaseapp.com",
        projectId: "infoseccompliance-chat",
        storageBucket: "infoseccompliance-chat.firebasestorage.app",
        messagingSenderId: "85538751648",
        appId: "1:85538751648:web:33636b48d1f0751d9775c5"
      };
    }
  } else {
    // For production, use placeholders that GitHub Actions will replace
    window.firebaseConfig = {
      apiKey: "AIzaSyALZWouXQCdO49GYYA5NTaeESVDcBHmZGs",
      authDomain: "infoseccompliance-chat.firebaseapp.com",
      projectId: "infoseccompliance-chat",
      storageBucket: "infoseccompliance-chat.firebasestorage.app",
      messagingSenderId: "85538751648",
      appId: "1:85538751648:web:33636b48d1f0751d9775c5"
    };
  }
  
  // Dispatch event to notify that Firebase config is ready
  document.dispatchEvent(new Event('firebaseConfigReady'));
}

// Load the config
loadFirebaseConfig(); 