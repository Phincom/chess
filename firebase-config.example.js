// Firebase Configuration - TEMPLATE
// Copy this file to firebase-config.js and fill in your real credentials
// DO NOT commit firebase-config.js with real credentials to GitHub!

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-rtdb.region.firebasedatabase.app",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase with proper error handling
let app;
let auth;
let db;

// Wait for Firebase to load
function initializeFirebase() {
    try {
        console.log("📌 Firebase config loaded");
        if (typeof firebase === 'undefined') {
            console.log('⏳ Firebase SDK not loaded yet, retrying in 500ms');
            setTimeout(initializeFirebase, 500);
            return;
        }
        
        console.log("✓ Firebase SDK available");
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.database();
        console.log("✓ Firebase initialized successfully");
        console.log("✓ Auth available:", typeof auth !== 'undefined');
        console.log("✓ Database available:", typeof db !== 'undefined');
    } catch (error) {
        console.error("✗ Firebase initialization error:", error.message);
        if (error.code === 'app/duplicate-app') {
            console.log("✓ Firebase already initialized (this is ok)");
            auth = firebase.auth();
            db = firebase.database();
        }
    }
}

// Initialize when DOM is ready
console.log("📋 Firebase config script loading... readyState:", document.readyState);
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    initializeFirebase();
}
