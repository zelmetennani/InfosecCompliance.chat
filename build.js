// build.js - Using existing Netlify environment variables
const fs = require('fs');
require('dotenv').config();

console.log('Starting build process with existing Netlify environment variables...');

// Check for environment variables
const envVars = {
  apiKey: process.env.apiKey || '',
  authDomain: process.env.authDomain || '',
  projectId: process.env.projectId || '',
  storageBucket: process.env.storageBucket || '',
  messagingSenderId: process.env.messagingSenderId || '',
  appId: process.env.appId || '',
  measurementId: process.env.measurementId || ''
};

// Log environment variable status (without revealing full values)
console.log('Environment variables check:');
Object.keys(envVars).forEach(key => {
  const value = envVars[key];
  const isSet = value && value.length > 0;
  console.log(`- ${key}: ${isSet ? 'Set ✓' : 'Not set ✗'}`);
});

// Create a direct config.js file with the values
const configContent = `
// Firebase configuration - Generated during build
window.firebaseConfig = {
  apiKey: "${envVars.apiKey}",
  authDomain: "infoseccompliance-chat.firebaseapp.com",
  projectId: "${envVars.projectId}",
  storageBucket: "${envVars.storageBucket}",
  messagingSenderId: "${envVars.messagingSenderId}",
  appId: "${envVars.appId}",
  measurementId: "${envVars.measurementId || ''}"
};

// Function to load Firebase config (for compatibility)
function loadFirebaseConfig() {
  console.log("Firebase config already loaded from environment variables");
  // Dispatch event to notify that Firebase config is ready
  document.dispatchEvent(new Event('firebaseConfigReady'));
}

// Load the config
loadFirebaseConfig();
`;

// Write the config file
fs.writeFileSync('config.js', configContent);
console.log('Generated config.js file with environment variables');

// Create _redirects file for Netlify if it doesn't exist
if (!fs.existsSync('_redirects')) {
  fs.writeFileSync('_redirects', '/*  /index.html  200');
  console.log('Created _redirects file for Netlify');
}

console.log('Build completed successfully!');