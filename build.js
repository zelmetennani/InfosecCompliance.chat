// build.js - Production focused with graceful fallbacks
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

// Log environment variables status (without revealing values)
console.log('Environment variables check:');
let allVarsPresent = true;
requiredVars.forEach(varName => {
  const isSet = process.env[varName] ? true : false;
  console.log(`- ${varName}: ${isSet ? '✓ Set' : '✗ Missing'}`);
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