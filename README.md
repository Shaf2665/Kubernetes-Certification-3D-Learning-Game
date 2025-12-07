# 🎮 Kubernetes Certification 3D Learning Game

> **Learn Kubernetes through interactive 3D challenges!** Master Kubernetes Fundamentals, CKA, and CKAD certifications by playing an engaging browser-based game.

## 🌟 What is This?

This is a **free, interactive 3D game** that teaches you Kubernetes step-by-step. Instead of reading boring documentation, you'll:

- 🎯 Complete hands-on challenges
- 🏆 Earn XP and unlock achievements
- 📚 Learn through interactive tutorials
- 🎨 See your Kubernetes cluster in 3D
- 💻 Practice real kubectl commands

Perfect for beginners and experienced DevOps engineers who want to prepare for Kubernetes certifications!

---

## ✨ Key Features

### 🎓 Three Certification Paths
- **Kubernetes Fundamentals** - Start here! Learn the basics
- **CKA (Certified Kubernetes Administrator)** - Master cluster management
- **CKAD (Certified Kubernetes Application Developer)** - Build and deploy applications

### 🎮 Game Features
- ⭐ Earn stars (1-3) for each challenge based on your performance
- 📈 Level up as you gain XP
- 🏅 Unlock achievement badges
- 🔥 Maintain daily streaks
- 📊 Track your progress automatically

### 🎨 Interactive 3D Experience
- See pods, nodes, and services in 3D
- Watch your cluster change in real-time
- Visualize Kubernetes concepts

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Check Requirements

You need:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

**Don't have Node.js?** 
- Download from: https://nodejs.org/
- Choose the "LTS" version (recommended)
- Install it (just click Next, Next, Next)

**Check if you have it:**
```bash
node --version
npm --version
```
If you see version numbers, you're good to go! ✅

### Step 2: Download the Game

**Option A: Using Git (Recommended)**
```bash
git clone https://github.com/Shaf2665/Kubernetes-Certification-3D-Learning-Game.git
cd Kubernetes-Certification-3D-Learning-Game
```

**Option B: Download ZIP**
1. Click the green "Code" button on GitHub
2. Click "Download ZIP"
3. Extract the ZIP file
4. Open the folder in your terminal/command prompt

### Step 3: Install Dependencies

Open your terminal/command prompt in the game folder and run:

```bash
npm install
```

**What does this do?** It downloads all the code libraries the game needs. This might take 1-2 minutes.

**⚠️ Seeing "moderate severity vulnerabilities" warning?**
Don't worry! This is **normal** and **not a problem**. The game will work perfectly fine. This warning just means npm found some minor security issues in the dependencies (not in your code). You can safely ignore it and continue. The game is safe to use.

**Troubleshooting:**
- If you see errors, make sure you're in the correct folder
- Try running `npm install` again
- Make sure you have internet connection
- If you see "vulnerabilities" warning, it's safe to ignore - the game will work fine

### Step 4: Start the Game

```bash
npm run dev
```

**What happens?** The game starts and you'll see something like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:5173**
3. You should see the game! 🎉

**That's it!** You're ready to play!

---

## 🎯 How to Play

### First Time Playing?

1. **Click "Kubernetes Fundamentals"** on the main menu
2. **Select Module 1** - Click on the first module card
3. **Read the Tutorial** - A tutorial will appear explaining what you'll learn
4. **Start Your First Challenge** - After the tutorial, your first challenge begins
5. **Open the Terminal** - Press the **`** (backtick) key to open the terminal
6. **Type Commands** - Try: `kubectl create pod my-first-pod`
7. **Complete Challenges** - Follow the instructions and complete tasks
8. **Earn Stars** - Get 1-3 stars based on how well you do!

### Game Controls

| Action | How to Do It |
|--------|--------------|
| Open Terminal | Press **`** (backtick key, usually above Tab) |
| Close Terminal | Press **`** again or click the X button |
| Type Commands | Click in terminal and type kubectl commands |
| Navigate Menus | Click buttons with your mouse |
| Go Back | Click the "← Back" button |

### Example Commands to Try

```bash
# Create a pod
kubectl create pod my-pod

# List all pods
kubectl get pods

# List all nodes
kubectl get nodes

# Create a deployment
kubectl create deployment web-app --replicas 3

# Scale a deployment
kubectl scale deployment web-app --replicas 5
```

---

## 📚 What You'll Learn

### Kubernetes Fundamentals (Start Here!)
- ✅ What Kubernetes is and why it's used
- ✅ Basic concepts: Pods, Nodes, Clusters
- ✅ How to use kubectl commands
- ✅ Understanding YAML files
- ✅ Cluster architecture basics

### CKA - Certified Kubernetes Administrator
- ✅ Setting up and managing clusters
- ✅ Using Helm and Kustomize
- ✅ Networking and services
- ✅ Storage management
- ✅ Troubleshooting cluster issues

### CKAD - Certified Kubernetes Application Developer
- ✅ Building applications on Kubernetes
- ✅ Deployment strategies
- ✅ Security (RBAC, Pod Security Standards)
- ✅ Network policies
- ✅ Application monitoring

---

## 🏆 Gamification Explained

### XP (Experience Points)
- Complete challenges → Earn XP
- Complete modules → Earn more XP
- Complete certifications → Earn lots of XP!

### Levels
- As you earn XP, you level up
- Higher levels = More achievements unlocked

### Stars
- ⭐ 1 Star = You completed it (good job!)
- ⭐⭐ 2 Stars = You did it well and fast
- ⭐⭐⭐ 3 Stars = Perfect! Fast, first try, no hints

### Achievements
Unlock badges like:
- 👶 First Steps - Create your first pod
- 🏆 Certified - Complete Fundamentals
- 👑 Triple Crown - Complete all three certifications
- 🔥 Streak Master - Play 7 days in a row

---

## 🛠️ Building for Production

Want to host this game on your website?

```bash
# Build the game
npm run build

# The files will be in the 'dist' folder
# Upload everything in 'dist' to your web server
```

**For GitHub Pages:**
1. Run `npm run build`
2. Go to your GitHub repository Settings
3. Go to Pages section
4. Set source to `dist` folder
5. Your game will be live at: `https://yourusername.github.io/repository-name`

---

## ❓ Troubleshooting

### "npm: command not found"
- **Problem:** Node.js/npm is not installed
- **Solution:** Install Node.js from https://nodejs.org/

### "Port 5173 already in use"
- **Problem:** Another program is using port 5173
- **Solution:** 
  - Close other programs using that port, OR
  - Stop the previous game instance (Ctrl+C in terminal)

### "Cannot find module"
- **Problem:** Dependencies not installed
- **Solution:** Run `npm install` again

### Game won't load in browser
- **Problem:** Browser cache or server not running
- **Solution:** 
  - Make sure `npm run dev` is still running
  - Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)
  - Try a different browser

### Terminal not opening
- **Problem:** Backtick key not working
- **Solution:** 
  - Make sure you're pressing the **`** key (usually above Tab)
  - Try clicking the terminal button if available
  - Check browser console for errors (F12)

### "2 moderate severity vulnerabilities" warning after npm install
- **Problem:** You see a warning about vulnerabilities after running `npm install`
- **Is this a problem?** **No!** This is completely normal and safe. The game will work perfectly.
- **What does it mean?** npm found some minor security issues in the dependencies (not in your code). These are usually in development tools and don't affect the game.
- **What should I do?**
  - **Option 1 (Recommended):** Just ignore it and continue! Run `npm run dev` and start playing.
  - **Option 2 (Optional):** If you want to fix it, run:
    ```bash
    npm audit fix
    ```
    This will try to automatically fix the issues. If it doesn't work, you can continue anyway - the game will still work fine.
- **Important:** Don't use `npm audit fix --force` unless you know what you're doing, as it might break things.

---

## 🎓 Learning Path

**Recommended Order:**

1. **Week 1-2:** Complete Kubernetes Fundamentals
   - Learn the basics
   - Get comfortable with kubectl
   - Understand pods and nodes

2. **Week 3-4:** Choose Your Path
   - **CKA Path:** If you want to manage clusters
   - **CKAD Path:** If you want to build applications
   - Or do both! 🚀

3. **Week 5+:** Master Advanced Topics
   - Helm and Kustomize
   - Network policies
   - Security best practices
   - Troubleshooting

---

## 🛠️ Technology Used

- **Three.js** - For 3D graphics
- **Vite** - Fast development server
- **JavaScript** - Game logic
- **CSS** - Beautiful styling
- **LocalStorage** - Saves your progress

---

## 🤝 Contributing

Found a bug? Have an idea? Want to add features?

1. Fork the repository
2. Make your changes
3. Submit a Pull Request

We welcome all contributions! 🎉

---

## 📝 License

This project is open source and available under the MIT License.

---

## 💬 Need Help?

- 🐛 Found a bug? [Open an issue](https://github.com/Shaf2665/Kubernetes-Certification-3D-Learning-Game/issues)
- 💡 Have a suggestion? [Open an issue](https://github.com/Shaf2665/Kubernetes-Certification-3D-Learning-Game/issues)
- ❓ Have questions? [Open an issue](https://github.com/Shaf2665/Kubernetes-Certification-3D-Learning-Game/issues)

---

## 🌟 Star This Project

If you find this game helpful, please give it a ⭐ star on GitHub! It helps others discover the game.

---

**Ready to start learning? Follow the Quick Start guide above and begin your Kubernetes journey! 🚀**

**Happy Learning! 🎓**
