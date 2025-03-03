// Load environment variables from .env file in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    fetch('/.env')
        .then(response => response.text())
        .then(text => {
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
        })
        .catch(error => console.error('Error loading .env file:', error));
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