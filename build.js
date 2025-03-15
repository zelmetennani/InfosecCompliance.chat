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

// Read the config template
let configContent = fs.readFileSync('config.template.js', 'utf8');

// Replace placeholders with actual values
configContent = configContent
  .replace('##FIREBASE_API_KEY##', envVars.apiKey)
  .replace('##FIREBASE_AUTH_DOMAIN##', envVars.authDomain)
  .replace('##FIREBASE_PROJECT_ID##', envVars.projectId)
  .replace('##FIREBASE_STORAGE_BUCKET##', envVars.storageBucket)
  .replace('##FIREBASE_MESSAGING_SENDER_ID##', envVars.messagingSenderId)
  .replace('##FIREBASE_APP_ID##', envVars.appId)
  .replace('##FIREBASE_MEASUREMENT_ID##', envVars.measurementId || '');

// Write the config file
fs.writeFileSync('config.js', configContent);
console.log('Generated config.js file with environment variables');

// Create _redirects file for Netlify if it doesn't exist
if (!fs.existsSync('_redirects')) {
  fs.writeFileSync('_redirects', '/*  /index.html  200');
  console.log('Created _redirects file for Netlify');
}

console.log('Build completed successfully!');