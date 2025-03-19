const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { initializeApp } = require('firebase/app');
const { 
  getAuth: getClientAuth, 
  signInWithEmailAndPassword 
} = require('firebase/auth');

// Initialize Firebase Admin once
let firebaseAdminApp;
if (!firebaseAdminApp) {
  // For Firebase Admin, we'll use a service account or application default credentials
  try {
    // Try to initialize with application default credentials
    firebaseAdminApp = admin.initializeApp({
      projectId: process.env.projectId
    });
    console.log("Firebase Admin initialized with application default credentials");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

// Initialize Firebase client for auth operations
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

const clientApp = initializeApp(firebaseConfig);
const clientAuth = getClientAuth(clientApp);

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
          // Use Firebase Admin to create the user
          const userRecord = await getAuth().createUser({
            email: email,
            password: password
          });
          
          // Use Firebase client to sign in and get the ID token
          const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
          const idToken = await userCredential.user.getIdToken();
          
          return {
            statusCode: 200,
            body: JSON.stringify({ 
              success: true, 
              uid: userRecord.uid,
              token: idToken
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
          // Use Firebase client to sign in and get the ID token
          const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
          const idToken = await userCredential.user.getIdToken();
          
          return {
            statusCode: 200,
            body: JSON.stringify({ 
              success: true, 
              uid: userCredential.user.uid,
              token: idToken
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