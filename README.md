# ♟ Multiplayer Chess Game

A full-featured multiplayer chess game built with HTML, CSS, JavaScript, and Firebase with real-time synchronization and Google authentication.

## Features

- ✨ **Full Chess Game Logic**: Complete implementation of chess rules including castling, en passant, and pawn promotion
- 🎮 **Multiplayer Support**: Real-time multiplayer using Firebase Realtime Database
- 🔐 **Google Sign-In**: Secure authentication with Google accounts
- 📊 **Game History**: Move history tracking and captured pieces display
- 🎨 **Beautiful UI**: Responsive design with smooth animations
- 📱 **Mobile Friendly**: Works on desktop, tablet, and mobile devices
- 🔄 **Real-time Sync**: Live updates for both players during gameplay

## Prerequisites

Before you start, you need:
- A Google account (for Google Sign-In)
- A Firebase project
- A modern web browser

## Setup Instructions

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "Chess Game")
4. Click through the setup (you can skip Google Analytics)
5. Wait for the project to be created

### Step 2: Add Web App to Firebase

1. In your Firebase project, click the Web icon (</> symbol)
2. Register app (give it a name like "Chess Game Web")
3. You'll receive a configuration object - **COPY THIS**
4. Don't click "Host with Firebase" - we'll do this manually

### Step 3: Configure Firebase Database

1. In the Firebase Console, go to "Realtime Database"
2. Click "Create Database"
3. Choose **Start in test mode** (for development)
4. Accept the default location
5. Click "Enable"

### Step 4: Enable Google Sign-In

1. In the Firebase Console, go to "Authentication"
2. Click "Get started"
3. Click on "Google" sign-in method
4. Toggle "Enable" to ON
5. Select your support email
6. Click "Save"

### Step 5: Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure your Firebase project is selected
3. Go to "Credentials" in the left sidebar
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. If prompted, configure OAuth consent screen first:
   - Choose "External" user type
   - Fill in required fields
   - Add `localhost` and your domain to authorized domains
6. Choose "Web application"
7. Click "Create"
8. Copy your Client ID
9. Add authorized URIs:
   - `http://localhost:8000`
   - `http://localhost:3000`
   - Your production domain (when ready)

### Step 6: Update Configuration Files

#### Update `firebase-config.js`:

Replace the config object with your Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

const googleSignInConfig = {
    client_id: 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com'
};
```

Find these values in:
- **Firebase Config**: Firebase Console → Project Settings → Your Apps → Web app config
- **Google Client ID**: Google Cloud Console → Credentials → OAuth 2.0 Client IDs

### Step 7: Update `index.html`

In the `<head>` section, find the Google Sign-In script and make sure it's included:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

## Running the Game

### Local Development

1. Install a simple HTTP server (if you don't have one):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Or using Node.js
   npx http-server
   ```

2. Navigate to the project directory and start the server

3. Open `http://localhost:8000` in your browser

4. The game will ask you to sign in with Google

### Important Note
Due to browser security restrictions, you **cannot** open `index.html` directly as a file. You must serve it via HTTP/HTTPS.

## How to Play

### Creating a Game
1. Sign in with your Google account
2. Click "Create New Game"
3. You'll be assigned as White (first player)
4. Share the Room ID with your opponent
5. Wait for them to join

### Joining a Game
1. Sign in with your Google account
2. Enter the Room ID in the input field
3. Click "Join Game"
4. You'll be assigned as Black (second player)

### Game Controls
- **Click a piece** to select it
- **Green highlighted squares** show valid moves for the selected piece
- **Click a highlighted square** to move the piece there
- **Captured pieces** are shown in the sidebar
- **Move history** is displayed in the sidebar
- Use **Resign** button to forfeit the game
- **Undo** button can request an undo (in future versions)

## Chess Rules Implemented

- ✅ Piece movement (all 6 piece types)
- ✅ Pawn promotion (promotes to queen)
- ✅ Castling (king-side and queen-side)
- ✅ En passant capture
- ✅ Check detection
- ✅ Checkmate detection
- ✅ Stalemate detection
- ✅ Captured piece tracking
- ✅ 50-move rule (in future update)
- ✅ Threefold repetition (in future update)

## File Structure

```
chess-game/
├── index.html           # Main HTML file
├── styles.css           # CSS styling
├── main.js             # Chess game logic and Firebase integration
├── firebase-config.js  # Firebase configuration
└── README.md           # This file
```

## Technologies Used

- **HTML5** - Markup structure
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Game logic and interactivity
- **Firebase Realtime Database** - Real-time multiplayer sync
- **Firebase Authentication** - Google Sign-In
- **Google Cloud Console** - OAuth setup

## Troubleshooting

### "Firebase is not defined"
- Make sure the Firebase SDK scripts are loaded in the correct order in `index.html`
- Check that your `firebase-config.js` is being loaded after the Firebase SDKs

### "Sign-in not working"
- Verify your Google Client ID is correct in `firebase-config.js`
- Check that `localhost` is added to authorized URIs in Google Cloud Console
- Make sure Google Sign-In is enabled in Firebase Authentication

### "Game won't sync"
- Verify your Firebase Realtime Database rules are set to test mode
- Check browser console for any error messages
- Make sure both players are signed in

### "Board not displaying"
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors
- Verify all files are in the correct directory

## Future Enhancements

- [ ] Chess engine for AI opponent
- [ ] Undo/Redo functionality
- [ ] Draw offers and acceptance
- [ ] Session replay feature
- [ ] Chat messaging between players
- [ ] Rating system
- [ ] Tournament mode
- [ ] Mobile app version
- [ ] Puzzle mode
- [ ] Analysis mode

## Deployment

To deploy this game:

1. **Firebase Hosting** (Recommended):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

2. **GitHub Pages**:
   - Push to a GitHub repository
   - Enable Pages in settings
   - Enable GitHub Actions

3. **Traditional Hosting**:
   - Upload files to any web server
   - Update authorized URIs in Google Cloud Console

## License

This project is open-source and available for educational and personal use.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Check browser console for error messages
3. Verify Firebase and Google Cloud setup
4. Review Firebase and Google Cloud documentation

## Credits

Built with ♥️ using HTML, CSS, JavaScript, and Firebase

---

**Happy Playing! ♟♚♞♝♛♗♘♖**
