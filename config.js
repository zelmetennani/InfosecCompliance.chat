// Load environment variables from .env file in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log("Running in development mode, attempting to load .env file");
    fetch('/.env')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load .env file: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            console.log("Successfully loaded .env file");
            const envVars = text.split('\n').reduce((acc, line) => {
                const [key, value] = line.split('=');
                if (key && value) {
                    acc[key.trim()] = value.trim();
                }
                return acc;
            }, {});
            
            window.firebaseConfig = {
                apiKey: envVars.FIREBASE_API_KEY,
                authDomain: envVars.FIREBASE_AUTH_DOMAIN,
                projectId: envVars.FIREBASE_PROJECT_ID,
                storageBucket: envVars.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: envVars.FIREBASE_MESSAGING_SENDER_ID,
                appId: envVars.FIREBASE_APP_ID,
                measurementId: envVars.FIREBASE_MEASUREMENT_ID
            };
            
            console.log("Firebase config loaded:", window.firebaseConfig);
            
            // Initialize Firebase after config is loaded
            initializeFirebase();
        })
        .catch(error => {
            console.error('Error loading .env file:', error);
            // Fall back to production config
            useProductionConfig();
        });
} else {
    console.log("Running in production mode");
    useProductionConfig();
}

function useProductionConfig() {
    window.firebaseConfig = {
        apiKey: "FIREBASE_API_KEY",
        authDomain: "FIREBASE_AUTH_DOMAIN",
        projectId: "FIREBASE_PROJECT_ID",
        storageBucket: "FIREBASE_STORAGE_BUCKET",
        messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
        appId: "FIREBASE_APP_ID",
        measurementId: "FIREBASE_MEASUREMENT_ID"
    };
    console.log("Using production config:", window.firebaseConfig);
    
    // Initialize Firebase after config is loaded
    initializeFirebase();
}

// This function will be called after config is loaded
function initializeFirebase() {
    // We'll initialize Firebase in the individual pages
    document.dispatchEvent(new Event('firebaseConfigReady'));
}

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig); 