// Ensure we don't have duplicate initialization
if (window.firebaseConfigInitialized) {
    console.log("Firebase config already initialized, skipping");
} else {
    window.firebaseConfigInitialized = true;
    
    console.log("Starting Firebase config initialization");
    
    // Firebase configuration - placeholders will be replaced during build
    window.firebaseConfig = {
        apiKey: "##FIREBASE_API_KEY##",
        authDomain: "##FIREBASE_AUTH_DOMAIN##",
        projectId: "##FIREBASE_PROJECT_ID##",
        storageBucket: "##FIREBASE_STORAGE_BUCKET##",
        messagingSenderId: "##FIREBASE_MESSAGING_SENDER_ID##",
        appId: "##FIREBASE_APP_ID##"
    };
    
    // For development environments, try to load from .env file
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log("Development environment detected, attempting to load local config");
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
                
                // Override with local values
                if (envVars.FIREBASE_API_KEY) {
                    window.firebaseConfig = {
                        apiKey: envVars.FIREBASE_API_KEY,
                        authDomain: envVars.FIREBASE_AUTH_DOMAIN,
                        projectId: envVars.FIREBASE_PROJECT_ID,
                        storageBucket: envVars.FIREBASE_STORAGE_BUCKET,
                        messagingSenderId: envVars.FIREBASE_MESSAGING_SENDER_ID,
                        appId: envVars.FIREBASE_APP_ID
                    };
                    console.log("Config loaded from local .env file");
                }
                initializeFirebase();
            })
            .catch(error => {
                console.error("Error loading local config:", error);
                initializeFirebase();
            });
    } else {
        // Production environment
        initializeFirebase();
    }
    
    function initializeFirebase() {
        // Check if placeholders were replaced
        if (window.firebaseConfig.apiKey.includes('##FIREBASE_API_KEY##')) {
            console.error("Firebase configuration placeholders not replaced!");
        }
        
        console.log("Firebase config ready");
        document.dispatchEvent(new Event('firebaseConfigReady'));
    }
} 