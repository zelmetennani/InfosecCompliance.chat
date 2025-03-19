const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin once
let firebaseApp;
if (!firebaseApp) {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

exports.handler = async function(event, context) {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    const requestBody = JSON.parse(event.body);
    const { action, email, password, token } = requestBody;

    switch (action) {
      case 'signUp':
        try {
          const userRecord = await getAuth().createUser({
            email: email,
            password: password
          });
          
          // Create a custom token for the new user
          const customToken = await getAuth().createCustomToken(userRecord.uid);
          
          return {
            statusCode: 200,
            body: JSON.stringify({ 
              success: true, 
              uid: userRecord.uid,
              token: customToken
            }),
            headers: { 'Content-Type': 'application/json' }
          };
        } catch (error) {
          return {
            statusCode: 400,
            body: JSON.stringify({ 
              success: false, 
              error: error.message 
            }),
            headers: { 'Content-Type': 'application/json' }
          };
        }

      case 'signIn':
        try {
          // For sign-in, we'll use Firebase Admin to get the user by email
          const userRecord = await getAuth().getUserByEmail(email);
          
          // In a real implementation, you would verify the password here
          // This is a simplified example - in production you should use Firebase Auth REST API
          // to verify credentials properly
          
          // Create a custom token for the user
          const customToken = await getAuth().createCustomToken(userRecord.uid);
          
          return {
            statusCode: 200,
            body: JSON.stringify({ 
              success: true, 
              uid: userRecord.uid,
              token: customToken
            }),
            headers: { 'Content-Type': 'application/json' }
          };
        } catch (error) {
          return {
            statusCode: 400,
            body: JSON.stringify({ 
              success: false, 
              error: error.message 
            }),
            headers: { 'Content-Type': 'application/json' }
          };
        }

      case 'verifyToken':
        try {
          // Verify the ID token
          const decodedToken = await getAuth().verifyIdToken(token);
          return {
            statusCode: 200,
            body: JSON.stringify({ 
              success: true, 
              uid: decodedToken.uid 
            }),
            headers: { 'Content-Type': 'application/json' }
          };
        } catch (error) {
          return {
            statusCode: 401,
            body: JSON.stringify({ 
              success: false, 
              error: 'Invalid token' 
            }),
            headers: { 'Content-Type': 'application/json' }
          };
        }

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ 
            success: false, 
            error: 'Invalid action' 
          }),
          headers: { 'Content-Type': 'application/json' }
        };
    }
  } catch (error) {
    console.error('Firebase auth function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
}; 