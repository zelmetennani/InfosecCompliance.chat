// build.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read the config.js template
const configTemplate = fs.readFileSync('config.template.js', 'utf8');

// Replace environment variables
const configContent = configTemplate
  .replace('process.env.FIREBASE_API_KEY', `"${process.env.FIREBASE_API_KEY}"`)
  .replace('process.env.FIREBASE_AUTH_DOMAIN', `"${process.env.FIREBASE_AUTH_DOMAIN}"`)
  .replace('process.env.FIREBASE_PROJECT_ID', `"${process.env.FIREBASE_PROJECT_ID}"`)
  .replace('process.env.FIREBASE_STORAGE_BUCKET', `"${process.env.FIREBASE_STORAGE_BUCKET}"`)
  .replace('process.env.FIREBASE_MESSAGING_SENDER_ID', `"${process.env.FIREBASE_MESSAGING_SENDER_ID}"`)
  .replace('process.env.FIREBASE_APP_ID', `"${process.env.FIREBASE_APP_ID}"`);

// Write the processed config.js
fs.writeFileSync('config.js', configContent);

console.log('Build completed successfully!');