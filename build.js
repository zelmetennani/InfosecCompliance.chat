// build.js - Production focused with debugging
const fs = require('fs');
require('dotenv').config();

// Read the config.js template
const configTemplate = fs.readFileSync('config.template.js', 'utf8');

// Check for required environment variables
const requiredVars = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID'
];

// Log environment variables status (without revealing full values)
console.log('Environment variables check:');
let allVarsPresent = true;
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = value ? true : false;
  // Show first 4 chars of value if it exists (for debugging)
  const debugValue = value ? value.substring(0, 4) + '...' : 'undefined';
  console.log(`- ${varName}: ${isSet ? '✓ Set' : '✗ Missing'} (${debugValue})`);
  if (!isSet) allVarsPresent = false;
});

if (!allVarsPresent) {
  console.warn('WARNING: Some environment variables are missing.');
  console.warn('The site will display an error message to users.');
  console.warn('Please set all required environment variables in Netlify.');
}

// Create a safer version of the config with proper string escaping
const safeConfig = {
  apiKey: JSON.stringify(process.env.FIREBASE_API_KEY || ''),
  authDomain: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN || ''),
  projectId: JSON.stringify(process.env.FIREBASE_PROJECT_ID || ''),
  storageBucket: JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET || ''),
  messagingSenderId: JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID || ''),
  appId: JSON.stringify(process.env.FIREBASE_APP_ID || '')
};

// Log the first few characters of each config value
console.log('Config values (first few chars):');
Object.keys(safeConfig).forEach(key => {
  console.log(`- ${key}: ${safeConfig[key].substring(0, 10)}...`);
});

// Replace environment variables with proper JSON strings
let configContent = configTemplate;
configContent = configContent.replace('process.env.FIREBASE_API_KEY', safeConfig.apiKey);
configContent = configContent.replace('process.env.FIREBASE_AUTH_DOMAIN', safeConfig.authDomain);
configContent = configContent.replace('process.env.FIREBASE_PROJECT_ID', safeConfig.projectId);
configContent = configContent.replace('process.env.FIREBASE_STORAGE_BUCKET', safeConfig.storageBucket);
configContent = configContent.replace('process.env.FIREBASE_MESSAGING_SENDER_ID', safeConfig.messagingSenderId);
configContent = configContent.replace('process.env.FIREBASE_APP_ID', safeConfig.appId);

// Write the processed config.js
fs.writeFileSync('config.js', configContent);

// Create a debug file to verify the replacements
fs.writeFileSync('config.debug.js', `
// This is a debug file to verify environment variable replacements
// DO NOT COMMIT THIS FILE TO YOUR REPOSITORY
// It will be automatically generated during build

window.debugConfig = {
  apiKey: ${safeConfig.apiKey},
  authDomain: ${safeConfig.authDomain},
  projectId: ${safeConfig.projectId},
  storageBucket: ${safeConfig.storageBucket},
  messagingSenderId: ${safeConfig.messagingSenderId},
  appId: ${safeConfig.appId}
};

console.log('Debug config:', window.debugConfig);
`);

// Create a message for local development
if (!process.env.NETLIFY) {
  console.log('Local development environment detected');
  console.log('For local development, create an env.js file with your Firebase config');
  
  // Create a sample env.js file if it doesn't exist
  if (!fs.existsSync('env.js.sample') && !fs.existsSync('env.js')) {
    const sampleEnv = `// Sample Firebase configuration - RENAME to env.js and add your own keys
export default {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
`;
    fs.writeFileSync('env.js.sample', sampleEnv);
    console.log('Created env.js.sample file - rename to env.js and add your Firebase config');
  }
}

console.log('Build completed successfully!');