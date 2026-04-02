# 🚀 GitHub Upload Instructions

## Quick Steps to Upload Safely

### 1. Initialize Git (if not already done)
```bash
cd "c:\Users\bingu\OneDrive\Desktop\New folder (3)\chess-game"
git init
```

### 2. Create Your Firebase Config (IMPORTANT!)
```bash
# Copy the template
cp firebase-config.example.js firebase-config.js
```

Edit `firebase-config.js` and add your real Firebase credentials:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-rtdb.region.firebasedatabase.app",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Verify .gitignore
The `.gitignore` file should already exist and contain:
```
firebase-config.js
.env
.env.local
node_modules/
```

✅ This prevents your real credentials from being committed!

### 4. First Time on GitHub
```bash
# Add all files (except .gitignore)
git add .

# Verify firebase-config.js is ignored
git status  # Should NOT show firebase-config.js

# Initial commit
git commit -m "Initial commit: Multiplayer chess game"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/chess-game.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 5. After Making Changes
```bash
# Add changes
git add .

# Commit with descriptive message
git commit -m "Fix king move validation"

# Push to GitHub
git push
```

---

## ✅ What Gets Uploaded to GitHub

- ✅ HTML, CSS, JavaScript files
- ✅ README and documentation
- ✅ .gitignore file
- ✅ firebase-config.example.js (template)

## ❌ What Does NOT Get Uploaded

- ❌ firebase-config.js (real credentials)
- ❌ .env files
- ❌ node_modules (if any)

---

## 🔐 Security Checklist Before Uploading

- [ ] Created `firebase-config.js` locally with your credentials
- [ ] Verified `.gitignore` contains `firebase-config.js`
- [ ] Ran `git status` and confirmed firebase-config.js is not listed
- [ ] Have a GitHub account
- [ ] Created a new empty repository on GitHub

---

## 📋 GitHub Repository Setup

1. Go to [GitHub.com](https://github.com)
2. Click **New** (+ icon)
3. Create repository:
   - Name: `chess-game`
   - Description: "Multiplayer chess game with Firebase"
   - Public or Private (your choice)
   - Do NOT initialize with README (we have one)
4. Click **Create repository**
5. Follow the commands shown on GitHub

---

## 🚀 Deploy (Optional)

Once on GitHub, you can deploy to:

### GitHub Pages
```bash
# In repo settings, enable GitHub Pages from main branch
# Your game will be live at: https://YOUR_USERNAME.github.io/chess-game/
```

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build command: (leave empty for client-side only)
4. Deploy!

### Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Deploy!

---

## 🆘 Troubleshooting

### "firebase-config.js was uploaded with credentials!"
- ⚠️ **IMMEDIATELY:**
  1. Regenerate your Firebase API key in Firebase Console
  2. Delete the repository and start over
  3. Ensure .gitignore has firebase-config.js

### "Git says firebase-config.js is tracked"
```bash
# Remove it from git (but keep local file)
git rm --cached firebase-config.js
git commit -m "Remove accidentally tracked firebase-config.js"
git push
```

### "I forgot to create firebase-config.js locally"
```bash
# Before your first commit:
cp firebase-config.example.js firebase-config.js
# Edit it with your real credentials
```

---

## ✨ You're Done!

Your chess game is now safely on GitHub with credentials protected! 🎉

Need help? Check README-SECURITY.md for more details.
