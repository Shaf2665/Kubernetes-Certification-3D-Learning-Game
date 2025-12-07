📘 Kubernetes 3D Fundamentals Learning Game
A fully gamified, interactive 3D environment to learn Kubernetes from scratch.
<img src="https://img.shields.io/badge/Kubernetes-3D%20Learning%20Game-blue?style=for-the-badge&logo=kubernetes"/> <img src="https://img.shields.io/badge/Babylon.js-WebGL%203D-green?style=for-the-badge&logo=babylondotjs"/> <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript"/> <img src="https://img.shields.io/badge/Vite-Next%20Gen%20Frontend-pink?style=for-the-badge&logo=vite"/>

🎮 About the Project

Kubernetes 3D Fundamentals Learning Game is a browser-based, interactive 3D gamification platform that teaches Kubernetes concepts through missions, simulations, and hands-on virtual labs.

Instead of reading documentation, users walk inside a 3D Kubernetes cluster, interact with Pods, Deployments, Nodes, Services, Volumes and more — all visualized as 3D objects that behave like real Kubernetes resources.

This project is designed for:

🧑‍💻 Beginners learning Kubernetes for the first time

🎓 Students preparing for Kubernetes Certifications (CKA / CKAD / KCNA)

🧰 Engineers who prefer hands-on, visual learning

🧪 Anyone who wants a fun and immersive way to understand Kubernetes fundamentals

🚀 Features
🌐 3D Kubernetes Cluster

Navigate a fully simulated 3D Kubernetes environment built using Babylon.js.

🎯 Gamified Missions

15+ Missions covering all Kubernetes fundamentals:

Pods

Deployments

ReplicaSets

Services

ConfigMaps & Secrets

Namespaces

Resource requests & limits

Probes

Storage (PV, PVC, Volumes)

Scheduling concepts

Networking basics

💡 Interactive Visual Entities

Every Kubernetes resource is shown as a 3D object:

| Kubernetes Object | In-Game Representation |
|------------------|------------------------|
| Pod | Robot sphere |
| Deployment | Factory that produces pods |
| Service | Router device |
| Node | Large server machine |
| ConfigMap | Information console |
| Secret | Locked safe |
| Volume | Storage cube |
| Scheduler | Drone that assigns pods |
| Events | Floating warning icons |

🧪 Hands-On Lab Mode

Run simulated kubectl commands to modify your 3D cluster:

```bash
kubectl create deployment nginx --image=nginx
kubectl delete pod pod-1
kubectl apply -f app.yaml
```

The 3D world updates instantly — no real cluster required.

🔔 Kubernetes Event Simulation

CrashLoopBackOff, Pending, OOMKilled, ImagePullError, scaling, rescheduling — all visually demonstrated.

🧭 Mission & Progress System

Your learning journey is guided step-by-step with:

- Missions
- Objectives
- XP rewards
- Unlockable levels

🧱 Project Structure
```
kube-learning-game/
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
│
├── public/
│   └── assets/
│       ├── models/
│       ├── textures/
│       └── icons/
│
└── src/
    ├── main.ts
    ├── app/
    ├── scenes/
    ├── kubernetes/
    ├── gameplay/
    └── ui/
```

## Key Modules

| Module | Description |
|--------|-------------|
| ClusterSimulator.ts | Simulates Kubernetes logic |
| PodEntity.ts | Visual + behavioral pod representation |
| DeploymentEntity.ts | Handles reconciliation & scaling |
| EventSystem.ts | Generates cluster warnings |
| TerminalUI.ts | Fake kubectl terminal interface |
| MissionsManager.ts | Mission progression engine |

🧩 Core Technologies Used

| Technology | Purpose |
|-----------|---------|
| Babylon.js | 3D rendering engine |
| TypeScript | Strong typing & maintainability |
| Vite | Fast bundling & development |
| ES Modules | Modular architecture |
| HTML/CSS | UI overlay |

⚙️ Installation & Local Development

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/Kubernetes-3D-Learning-Game.git
cd Kubernetes-3D-Learning-Game
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start Development Server

```bash
npm run dev
```

Now open:

**http://localhost:5173/**

🌍 Deployment (GitHub Pages Compatible)

The project uses Vite with:

```typescript
base: "./"
```

so the build works on GitHub Pages.

### Build for Production

```bash
npm run build
```

### Test the Build Locally

```bash
npx http-server ./dist
```

Upload the `dist/` folder to GitHub Pages or any static hosting.

🧭 Roadmap

✅ **Phase 1 — Kubernetes Fundamentals (Current)**

- All fundamental resources
- Visual cluster representation
- kubectl simulator
- 15 guided missions

🚧 **Phase 2 — CKA Exam Concepts**

- Scheduling algorithms
- etcd simulation
- Controller behavior in-depth
- Node failures
- Advanced debugging missions

🚧 **Phase 3 — CKAD Concepts**

- Multi-container pods
- Probes
- Resource limits
- Job/CronJob scheduling challenges

🚧 **Phase 4 — CKS Security Mode**

- RBAC visualization
- Network policies
- TLS concepts
- Pod security demo

Contributions are welcome!

🤝 Contributing

We welcome:

- Feature additions
- Bug fixes
- 3D models
- Mission ideas
- UI improvements

To contribute:

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

Please ensure TypeScript code is clean, modular, and documented.

⭐ Acknowledgements

This project is part of an initiative to make Kubernetes education:

- Visual
- Interactive
- Beginner-friendly
- Gamified
- Fun

Thanks to the open-source community and everyone who contributes!
