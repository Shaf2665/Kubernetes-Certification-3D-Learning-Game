import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { ArchitectureTimeline } from '../animations/ArchitectureTimeline.js';
import { AnimationController } from '../ui/AnimationController.js';

/**
 * Architecture scene - Explains Kubernetes architecture components with animations
 */
export class ArchitectureScene {
    private static timeline: ArchitectureTimeline | null = null;
    private static animationController: AnimationController | null = null;

    static async create(engine: Engine): Promise<Scene> {
        const scene = new Scene(engine);
        
        // Create camera
        const camera = new FreeCamera('camera', new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(engine.getRenderingCanvas()!, true);

        // Create light
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        // Create simple background
        const ground = MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, scene);
        const groundMaterial = new StandardMaterial('groundMat', scene);
        groundMaterial.diffuseColor = new Color3(0.1, 0.1, 0.15);
        ground.material = groundMaterial;

        // Initialize timeline
        this.timeline = new ArchitectureTimeline(scene);
        this.setupTimeline();
        this.setup3DComponents(scene);

        // Create UI
        this.createUI(scene);

        return scene;
    }

    private static setup3DComponents(_scene: Scene): void {
        if (!this.timeline) return;

        // Control Plane Components (left side)
        this.timeline.createComponentMesh('apiServer', new Vector3(-6, 2, 0), new Color3(0.29, 0.56, 0.89), 1);
        this.timeline.createComponentMesh('etcd', new Vector3(-6, 0, 0), new Color3(0.29, 0.56, 0.89), 1);
        this.timeline.createComponentMesh('scheduler', new Vector3(-6, -2, 0), new Color3(0.29, 0.56, 0.89), 1);
        this.timeline.createComponentMesh('controllerManager', new Vector3(-6, -4, 0), new Color3(0.29, 0.56, 0.89), 1);

        // Worker Nodes (right side)
        this.timeline.createComponentMesh('node1', new Vector3(4, 1, 0), new Color3(1, 0.76, 0.03), 1.5);
        this.timeline.createComponentMesh('node2', new Vector3(4, -3, 0), new Color3(1, 0.76, 0.03), 1.5);

        // Kubelets on nodes
        this.timeline.createComponentMesh('kubelet1', new Vector3(5.5, 1, 0), new Color3(1, 0.76, 0.03), 0.5);
        this.timeline.createComponentMesh('kubelet2', new Vector3(5.5, -3, 0), new Color3(1, 0.76, 0.03), 0.5);

        // Pods
        this.timeline.createComponentMesh('pod1', new Vector3(4, 2.5, 0), new Color3(0.3, 0.8, 0.3), 0.6);
        this.timeline.createComponentMesh('pod2', new Vector3(4, 3.5, 0), new Color3(0.3, 0.8, 0.3), 0.6);
        this.timeline.createComponentMesh('pod3', new Vector3(4, -1.5, 0), new Color3(0.3, 0.8, 0.3), 0.6);

        // Create arrows
        this.timeline.createArrow('client', 'apiServer', new Color3(1, 1, 1));
        this.timeline.createArrow('apiServer', 'etcd', new Color3(0.29, 0.56, 0.89));
        this.timeline.createArrow('scheduler', 'node1', new Color3(0.29, 0.56, 0.89));
        this.timeline.createArrow('kubelet1', 'pod1', new Color3(1, 0.76, 0.03));
        this.timeline.createArrow('controllerManager', 'pod2', new Color3(0.29, 0.56, 0.89));
    }

    private static setupTimeline(): void {
        if (!this.timeline) return;

        // Step 1: Fade in control plane
        this.timeline.step(0, () => {
            this.timeline!.showComponent('apiServer');
            this.timeline!.showComponent('etcd');
            this.timeline!.showComponent('scheduler');
            this.timeline!.showComponent('controllerManager');
        }, 'The control plane components appear: API Server, etcd, Scheduler, and Controller Manager.', 
        'The control plane is the brain of Kubernetes, making all decisions about cluster state.');

        // Step 2: Client request arrow → API Server
        this.timeline.step(1000, () => {
            this.timeline!.showArrow('client', 'apiServer');
            this.timeline!.showComponent('apiServer', true);
        }, 'A client sends a request to create a Pod. The request goes to the API Server.', 
        'All communication with Kubernetes goes through the API Server, which validates and processes requests.');

        // Step 3: API Server writes to etcd
        this.timeline.step(2000, () => {
            this.timeline!.showArrow('apiServer', 'etcd');
            this.timeline!.showComponent('etcd', true);
        }, 'The API Server persists the request to etcd, the cluster\'s distributed database.', 
        'etcd stores all cluster state. Every change is recorded here for consistency and recovery.');

        // Step 4: Scheduler selects node
        this.timeline.step(3000, () => {
            this.timeline!.showComponent('scheduler', true);
            this.timeline!.showArrow('scheduler', 'node1');
            this.timeline!.showComponent('node1', true);
        }, 'The Scheduler examines available nodes and selects node1 to run the Pod.', 
        'The Scheduler considers resource availability, constraints, and affinity rules when placing Pods.');

        // Step 5: Kubelet spawns Pod
        this.timeline.step(4000, () => {
            this.timeline!.showComponent('kubelet1', true);
            this.timeline!.showArrow('kubelet1', 'pod1');
            this.timeline!.showComponent('pod1');
        }, 'The Kubelet on node1 receives the Pod specification and creates the container.', 
        'Kubelet is the agent on each node that communicates with the control plane and manages Pods.');

        // Step 6: Controller Manager adjusts replicas
        this.timeline.step(5000, () => {
            this.timeline!.showComponent('controllerManager', true);
            this.timeline!.showArrow('controllerManager', 'pod2');
            this.timeline!.showComponent('pod2');
            this.timeline!.showComponent('pod3');
        }, 'The Controller Manager ensures the desired number of replicas are running.', 
        'Controllers continuously watch cluster state and reconcile it to match the desired configuration.');
    }

    private static createUI(scene: Scene): void {
        const existingUI = document.getElementById('architecture-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const container = document.createElement('div');
        container.id = 'architecture-ui';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            z-index: 1000;
            pointer-events: none;
        `;

        // Educational content panel
        container.innerHTML = `
            <div style="
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                max-width: 600px;
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #4a90e2;
                border-radius: 12px;
                padding: 20px;
                pointer-events: auto;
                max-height: 70vh;
                overflow-y: auto;
            ">
                <h1 style="color: #4a90e2; font-size: 28px; margin: 0 0 20px 0;">Kubernetes Architecture</h1>
                <div id="architecture-content">
                    ${this.getEducationalContent()}
                </div>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button id="btn-back-arch" style="
                        background: rgba(100, 100, 100, 0.5);
                        color: #ddd;
                        border: 1px solid #666;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">← Back</button>
                    <button id="btn-next-arch" style="
                        background: #4a90e2;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Next →</button>
                </div>
            </div>

            <div id="architecture-narration" style="
                position: absolute;
                top: 20px;
                right: 20px;
                max-width: 400px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #ffc107;
                border-radius: 12px;
                padding: 20px;
                pointer-events: auto;
                display: none;
            ">
                <h3 style="color: #ffc107; margin: 0 0 10px 0;">Animation Narration</h3>
                <p id="narration-text" style="color: #ddd; line-height: 1.6; margin: 0 0 10px 0;"></p>
                <button id="btn-explain-more" style="
                    background: rgba(255, 193, 7, 0.2);
                    color: #ffc107;
                    border: 1px solid #ffc107;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                ">Explain More</button>
                <div id="explanation-text" style="
                    margin-top: 10px;
                    padding: 10px;
                    background: rgba(255, 193, 7, 0.1);
                    border-radius: 5px;
                    color: #aaa;
                    font-size: 13px;
                    display: none;
                "></div>
            </div>

            <div id="animation-controller-container"></div>
        `;

        document.body.appendChild(container);

        // Setup narration callback
        if (this.timeline) {
            this.timeline.setNarrationCallback((text, explanation) => {
                const narrationEl = document.getElementById('architecture-narration');
                const textEl = document.getElementById('narration-text');
                const explanationEl = document.getElementById('explanation-text');
                
                if (narrationEl && textEl) {
                    narrationEl.style.display = 'block';
                    textEl.textContent = text;
                    
                    if (explanationEl && explanation) {
                        explanationEl.textContent = explanation;
                        explanationEl.style.display = 'none';
                        
                        const explainBtn = document.getElementById('btn-explain-more');
                        if (explainBtn) {
                            const newBtn = explainBtn.cloneNode(true) as HTMLElement;
                            explainBtn.parentNode?.replaceChild(newBtn, explainBtn);
                            newBtn.addEventListener('click', () => {
                                explanationEl.style.display = explanationEl.style.display === 'none' ? 'block' : 'none';
                            });
                        }
                    }
                }
            });
        }

        // Setup animation controller
        setTimeout(() => {
            try {
                this.animationController = new AnimationController('animation-controller-container');
                this.animationController.setOnPlay(() => {
                    if (this.timeline) {
                        this.timeline.play();
                        this.animationController?.setPlaying(true);
                    }
                });
                this.animationController.setOnPause(() => {
                    if (this.timeline) {
                        this.timeline.pause();
                        this.animationController?.setPlaying(false);
                    }
                });
                this.animationController.setOnStepForward(() => {
                    if (this.timeline) {
                        this.timeline.stepForward();
                    }
                });
                this.animationController.setOnStepBack(() => {
                    if (this.timeline) {
                        this.timeline.stepBackward();
                    }
                });
                this.animationController.setOnSpeedChange((speed) => {
                    if (this.timeline) {
                        this.timeline.setSpeed(speed);
                    }
                });
            } catch (err) {
                console.error('[ArchitectureScene] Failed to create animation controller:', err);
            }
        }, 100);

        // Setup navigation buttons
        const backBtn = document.getElementById('btn-back-arch');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: 'main-menu' } 
                }));
            });
        }

        const nextBtn = document.getElementById('btn-next-arch');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const { LearningJourneyManager } = require('../gameplay/LearningJourneyManager.js');
                const manager = new LearningJourneyManager();
                manager.completeModule('architecture');
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: 'setup' } 
                }));
            });
        }

        (scene as any).ui = container;
    }

    private static getEducationalContent(): string {
        return `
            <div style="color: #ddd; line-height: 1.8; font-size: 16px;">
                <p style="margin-bottom: 15px;">
                    A Kubernetes cluster consists of a control plane (manages the cluster) and worker nodes (run your applications).
                </p>

                <div style="margin: 20px 0; padding: 15px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                    <p style="font-size: 18px; color: #4a90e2; margin-bottom: 10px;"><strong>🎛️ Control Plane Components</strong></p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li><strong>API Server:</strong> Front-end for Kubernetes. All communication goes through the API Server.</li>
                        <li><strong>etcd:</strong> Distributed key-value store. Stores all cluster data and configuration.</li>
                        <li><strong>Scheduler:</strong> Decides which node should run each pod based on resources and constraints.</li>
                        <li><strong>Controller Manager:</strong> Runs controllers that maintain desired state.</li>
                    </ul>
                </div>

                <div style="margin: 20px 0; padding: 15px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="font-size: 18px; color: #ffc107; margin-bottom: 10px;"><strong>🖥️ Node Components</strong></p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li><strong>Kubelet:</strong> Agent that runs on each node. Manages pods and communicates with the control plane.</li>
                        <li><strong>Kube Proxy:</strong> Maintains network rules. Enables Service networking and load balancing.</li>
                        <li><strong>Container Runtime:</strong> Software that runs containers (Docker, containerd, CRI-O).</li>
                    </ul>
                </div>

                <p style="margin-top: 20px; color: #4caf50;">
                    <strong>💡 Tip:</strong> Click "Play" in the animation controls below to see how these components interact!
                </p>
            </div>
        `;
    }
}
