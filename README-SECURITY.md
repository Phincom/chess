# ♟️ Multiplayer Chess Game

A real-time multiplayer chess game built with **HTML5, CSS3, JavaScript, and Firebase**.

## Features

✅ **Full Chess Rules**
- All piece movements (pawns, rooks, bishops, knights, queens, kings)
- Castling (kingside & queenside)
- En passant captures
- Pawn promotion
- Check, checkmate, and stalemate detection
- Pinned piece validation

✅ **Multiplayer**
- Real-time synchronization with Firebase
- Player lobby with opponent discovery
- Match requests and challenge system
- In-game chat messaging

✅ **User Features**
- Email/password authentication
- Player profiles with ELO ratings
- Game history (last 20 games)
- Leaderboard (top 10 players)

✅ **Game Features**
- Multiple time controls (10/5/3/1 min, unlimited)
- Sound effects (move, check, checkmate)
- Real-time network latency indicator
- Mobile responsive design
- Customizable board and UI colors
- Dark theme

---

## 🔒 Security Setup (IMPORTANT!)

**This project uses Firebase with sensitive credentials. Follow these steps BEFORE uploading to GitHub:**

### Step 1: Get Your Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to **Project Settings** (⚙️ icon)
4. Copy your Firebase config

### Step 2: Create Local Firebase Config
```bash
# The file firebase-config.js is ALREADY in .gitignore
# Create your local config:
cp firebase-config.example.js firebase-config.js
```

### Step 3: Add Your Real Credentials
Edit `firebase-config.js` and replace with your real Firebase credentials:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_REAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-rtdb.region.firebasedatabase.app",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};
```

### Step 4: Verify .gitignore
The `.gitignore` file already prevents committing:
- `firebase-config.js` ✅
- `.env` files ✅
- Node modules ✅

### Step 5: Upload to GitHub
```bash
git add .
git commit -m "Initial chess game commit"
git push origin main
```

✅ **Your Firebase credentials will NOT be exposed!**

---

## 🚀 Setup & Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase account (free tier works)

### Local Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/chess-game.git
cd chess-game
```

2. Create your local Firebase config:
```bash
cp firebase-config.example.js firebase-config.js
```

3. Add your Firebase credentials to `firebase-config.js`

4. Open `index.html` in your browser

### Deployment
1. Deploy to GitHub Pages, Netlify, Vercel, or your own server
2. Make sure `firebase-config.js` is added to `.gitignore`
3. Each deployment environment can have its own `firebase-config.js`

---

## 📋 Firebase Rules Setup

Set up these security rules in Firebase Console → Database Rules:

```json
{
  "rules": {
    "players": {
      ".read": true,
      ".write": true
    },
    "games": {
      ".read": true,
      ".write": true
    },
    "games_history": {
      ".read": true,
      ".write": true
    },
    "challenges": {
      ".read": true,
      ".write": true
    },
    "chat": {
      ".read": true,
      ".write": true
    },
    "ping_test": {
      ".read": true,
      ".write": true
    }
  }
}
```

⚠️ **For production**, use stricter rules that validate user authentication.

---

## 🎮 How to Play

1. **Register** with email and password
2. **Log In** to see the lobby
3. **Join Lobby** to see available opponents
4. **Ask for Match** to challenge another player
5. **Accept Challenge** when someone challenges you
6. **Play Chess** - full rules enforced!

---

## 📁 Project Structure

```
chess-game/
├── index.html              # Main UI
├── styles.css              # Styling & dark theme
├── main.js                 # Game engine & logic
├── firebase-config.js      # Firebase config (LOCAL ONLY)
├── firebase-config.example.js  # Firebase config template
├── .gitignore              # Git ignore file
├── README.md               # This file
└── QUICKSTART.md           # Quick setup guide
```

---

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Email/Password Auth
- **Hosting**: Can deploy anywhere (GitHub Pages, Netlify, Vercel, etc.)

---

## 📝 License

MIT License - Feel free to use and modify!

---

## ⚠️ Important Security Notes

1. **Never commit `firebase-config.js`** with real credentials
2. **Never share your Firebase API key** publicly
3. **Use environment variables** for production deployments
4. **Review Firebase security rules** for your specific use case
5. **Implement proper user validation** on the server side

---

## 🐛 Known Issues & TODO

- [ ] Implement stricter Firebase security rules
- [ ] Add user email verification
- [ ] Add password reset functionality
- [ ] Store ratings persistently
- [ ] Add game replay/analysis
- [ ] Add friend list system
- [ ] Mobile app version

---

## 🤝 Contributing

Feel free to fork, modify, and improve!

---

**Made with ♟️ by Bingu**
