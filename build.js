/**
 * Simplified build script for Netlify deployment
 * Generates Firebase configuration from environment variables
 */

const fs = require('fs-extra');

// Required Firebase configuration keys
const REQUIRED_ENV_VARS = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
];

function main() {
  console.log('Starting build process...');
  
  // Validate environment variables
  const missingVars = validateEnvironmentVariables();
  if (missingVars.length > 0) {
    console.error(`ERROR: Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please set these variables in your Netlify dashboard.');
    process.exit(1);
  }
  
  // Generate Firebase configuration
  generateFirebaseConfig();
  
  console.log('Build completed successfully!');
}

function validateEnvironmentVariables() {
  const missingVars = [];
  
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  return missingVars;
}

function generateFirebaseConfig() {
  console.log('Generating Firebase configuration...');
  
  // Create Firebase configuration object from environment variables
  const firebaseConfig = {};
  for (const envVar of REQUIRED_ENV_VARS) {
    firebaseConfig[envVar] = process.env[envVar];
  }
  
  // Create config.js file
  const configContent = `
// Firebase configuration - Auto-generated during build
window.firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

// Dispatch event to notify that config is ready
document.dispatchEvent(new Event('firebaseConfigReady'));
`;

  // Write config file
  fs.writeFileSync('config.js', configContent);
  console.log('Firebase configuration generated successfully.');
}

// Run the build process
main();