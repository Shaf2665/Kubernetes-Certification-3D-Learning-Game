# Kubernetes 3D Fundamentals Learning Game

A fully interactive, gamified 3D learning experience for mastering Kubernetes fundamentals. Built with Babylon.js, TypeScript, and Vite.

## 🎮 Features

- **Interactive 3D Visualizations** - See Kubernetes objects come to life in 3D
- **Hands-on Labs** - Practice with a simulated kubectl terminal
- **Gamified Missions** - Complete 15+ missions to master Kubernetes
- **Cluster Simulator** - Realistic cluster behavior simulation
- **Progress Tracking** - Track your learning journey with XP and badges

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Learning Path

The game covers all Kubernetes fundamentals:

- **Kubernetes Basics** - Control plane, nodes, components
- **Core API Objects** - Pods, Deployments, Services, ConfigMaps, Secrets
- **Config & Scheduling** - Labels, affinity, resource limits
- **Networking** - Pod networking, Services, DNS, Ingress
- **Storage** - Volumes, PVs, PVCs, StorageClasses
- **Observability** - Logs, Events, Health probes

## 🎯 Missions

Complete 15 interactive missions:

1. Create your first Pod
2. Scale a Deployment
3. Fix a crashing Pod
4. Create a Service
5. Use a ConfigMap
6. Use a Secret
7. Work with ReplicaSets
8. Create & switch Namespaces
9. Apply resource limits
10. Configure probes
11. Attach a Volume
12. Use affinity rules
13. Expose an app via NodePort
14. Inspect cluster events
15. Final Challenge: Create a mini application stack

## 🛠️ Technology Stack

- **Babylon.js** - 3D WebGL engine
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **ES Modules** - Modern JavaScript modules

## 📦 Project Structure

```
src/
├── app/           # Core game systems
├── scenes/        # Scene managers
├── kubernetes/    # Kubernetes entity classes
├── gameplay/      # Mission and progress systems
└── ui/            # UI components
```

## 🌐 Deployment

The game is configured for GitHub Pages deployment:

```bash
npm run build
# Deploy the dist/ folder to GitHub Pages
```

## 📝 License

MIT License

