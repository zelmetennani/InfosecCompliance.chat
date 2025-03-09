// Ensure we don't have duplicate initialization
if (window.firebaseConfigInitialized) {
    console.log("Firebase config already initialized, skipping");
} else {
    window.firebaseConfigInitialized = true;
    
    console.log("Starting Firebase config initialization");
    
    // For production environment - these placeholders will be replaced by GitHub Actions
    window.firebaseConfig = {
        apiKey: "AIzaSyALZWouXQCdO49GYYA5NTaeESVDcBHmZGs",
        authDomain: "infoseccompliance-chat.firebaseapp.com",
        projectId: "infoseccompliance-chat",
        storageBucket: "infoseccompliance-chat.firebasestorage.app",
        messagingSenderId: "85538751648",
        appId: "1:85538751648:web:33636b48d1f0751d9775c5",
        measurementId: "G-T8PJLE1Q4X"
    };
    
    console.log("Firebase config set:", window.firebaseConfig);
    
    // Check if we're in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log("Running in development mode");
        // In development, try to fetch from .env file
        fetch('/.env')
            .then(response => response.text())
            .then(text => {
                const envVars = {};
                text.split('\n').forEach(line => {
                    const [key, value] = line.split('=');
                    if (key && value) {
                        envVars[key.trim()] = value.trim();
                    }
                });
                
                window.firebaseConfig = {
                    apiKey: envVars.FIREBASE_API_KEY,
                    authDomain: envVars.FIREBASE_AUTH_DOMAIN,
                    projectId: envVars.FIREBASE_PROJECT_ID,
                    storageBucket: envVars.FIREBASE_STORAGE_BUCKET,
                    messagingSenderId: envVars.FIREBASE_MESSAGING_SENDER_ID,
                    appId: envVars.FIREBASE_APP_ID,
                    measurementId: envVars.FIREBASE_MEASUREMENT_ID
                };
                
                console.log("Firebase config loaded from .env");
                
                // Initialize Firebase after config is loaded
                initializeFirebase();
            })
            .catch(error => {
                console.error('Error loading .env file:', error);
                // Use the production config already set
                initializeFirebase();
            });
    } else {
        console.log("Running in production mode");
        initializeFirebase();
    }
    
    // This function will be called after config is loaded
    function initializeFirebase() {
        // We'll initialize Firebase in the individual pages
        console.log("Dispatching firebaseConfigReady event");
        document.dispatchEvent(new Event('firebaseConfigReady'));
    }
} 