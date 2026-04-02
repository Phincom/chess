// Firebase Configuration
// IMPORTANT: Do NOT commit real Firebase credentials to GitHub!
// Copy firebase-config.example.js to firebase-config.js and add your real credentials

const firebaseConfig = {
    apiKey: "AIzaSyApASJcGlK4X0x42F44knJfulRNf_AY1J4",
    authDomain: "chess-f45b3.firebaseapp.com",
    databaseURL: "https://chess-f45b3-default-rtdb.firebaseio.com",
    projectId: "chess-f45b3",
    storageBucket: "chess-f45b3.firebasestorage.app",
    messagingSenderId: "205806596092",
    appId: "1:205806596092:web:3d445d4f76db320a098c79"
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
