// build.js - Using existing Netlify environment variables
const fs = require('fs');
require('dotenv').config();

console.log('Starting build process with existing Netlify environment variables...');

// Check for environment variables - try both formats
const envVars = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.apiKey || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.authDomain || '',
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.projectId || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.storageBucket || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.messagingSenderId || '',
  appId: process.env.FIREBASE_APP_ID || process.env.appId || ''
};

// Log environment variable status (without revealing full values)
console.log('Environment variables check:');
Object.keys(envVars).forEach(key => {
  const value = envVars[key];
  const isSet = value && value.length > 0;
  // Show first 4 chars of value if it exists (for debugging)
  const debugValue = isSet ? value.substring(0, 4) + '...' : 'undefined';
  console.log(`- ${key}: ${isSet ? '✓ Set' : '✗ Missing'} (${debugValue})`);
});

// Create a direct Firebase config file with the values
const configContent = `
// Firebase configuration - Generated during build
(function() {
  // Set the Firebase configuration directly
  window.firebaseConfig = {
    apiKey: "${envVars.apiKey}",
    authDomain: "${envVars.authDomain}",
    projectId: "${envVars.projectId}",
    storageBucket: "${envVars.storageBucket}",
    messagingSenderId: "${envVars.messagingSenderId}",
    appId: "${envVars.appId}"
  };
  
  console.log('Firebase config loaded:', {
    apiKey: window.firebaseConfig.apiKey ? window.firebaseConfig.apiKey.substring(0, 4) + '...' : 'missing',
    authDomain: window.firebaseConfig.authDomain || 'missing',
    projectId: window.firebaseConfig.projectId || 'missing'
  });
  
  // Check if config is valid
  const isConfigValid = window.firebaseConfig.apiKey && 
                       window.firebaseConfig.apiKey !== 'undefined' && 
                       window.firebaseConfig.apiKey !== '';
  
  if (!isConfigValid) {
    console.error("Firebase configuration is invalid or missing API key");
    document.dispatchEvent(new CustomEvent('firebaseConfigError', { 
      detail: { message: "Invalid Firebase configuration" } 
    }));
  }
  
  // Note: We don't initialize Firebase here anymore
  // auth.js will handle the initialization
})();
`;

// Write the config file
fs.writeFileSync('config.js', configContent);
console.log('Generated config.js file with environment variables');

// Create a _redirects file for Netlify if it doesn't exist
if (!fs.existsSync('_redirects')) {
  fs.writeFileSync('_redirects', '/*  /index.html  200');
  console.log('Created _redirects file for Netlify');
}

console.log('Build completed successfully!');