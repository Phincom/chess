# Quick Start Guide - Setup in 5 Minutes

## The Fast Way to Get Started

### 1. Create Firebase Project (2 min)
- Go to https://console.firebase.google.com
- Click "Create Project"
- Name it "Chess Game"
- Click through setup → Create project

### 2. Create Web App (1 min)
- Click the Web icon (</> symbol)
- Name it "Chess Game Web"
- **Copy the config** you receive (you'll need this!)
- Skip "Host with Firebase"

### 3. Setup Database (1 min)
- Go to "Realtime Database"
- Click "Create Database"
- Choose "Test mode" → Enable
- Done!

### 4. Setup Google Sign-In (1 min)
- Go to "Authentication"
- Click "Get started"
- Click on "Google"
- Toggle it ON
- Click "Save"

### 5. Get Google Client ID (1 min)
- Go to https://console.cloud.google.com
- Make sure your project is selected
- Go to "Credentials" section
- Click "Create Credentials" → "OAuth 2.0 Client ID"
- Choose "Web application"
- Add these URIs:
  - `http://localhost:8000`
  - `http://localhost:3000`
  - Your domain (when deploying)
- Click "Create"
- **Copy your Client ID**

### 6. Update Configuration Files

**In `firebase-config.js`, replace:**
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const googleSignInConfig = {
    client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
};
```

**With YOUR actual credentials from:**
- Firebase Console → Project Settings → Your Apps → Web
- Google Cloud Console → Credentials

### 7. Run Locally

```bash
# Using Python 3
python -m http.server 8000

# OR using Node.js
npx http-server
```

Then open: **http://localhost:8000**

## Playing Chess

1. Sign in with Google
2. **Player 1**: Click "Create New Game" → Copy Room ID
3. **Player 2**: Paste Room ID → Click "Join Game"
4. **Play!** White moves first

## Common Mistakes to Avoid

❌ **Don't** open the HTML file directly (you must use HTTP)
❌ **Don't** forget to copy your Firebase config
❌ **Don't** forget to enable Google Sign-In
❌ **Don't** use production mode for development

## Need Help?

If something doesn't work:
1. Check browser console (F12 → Console)
2. Verify your Firebase config is correct
3. Make sure Google Sign-In is enabled
4. Check that you're using `http://localhost` not `file://`

**That's it! You're ready to play multiplayer chess! ♟**
