import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { LearningJourneyManager } from '../gameplay/LearningJourneyManager.js';
import { TheorySimulator } from '../ui/TheorySimulator.js';

/**
 * Core Concepts scene - Explains Pods, ReplicaSets, Deployments with Theory Simulator
 */
export class CoreConceptsScene {
    private static learningJourneyManager: LearningJourneyManager;
    private static theorySimulator: TheorySimulator | null = null;

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

        this.learningJourneyManager = new LearningJourneyManager();
        this.createUI(scene);

        return scene;
    }

    private static createUI(scene: Scene): void {
        const existingUI = document.getElementById('core-concepts-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const container = document.createElement('div');
        container.id = 'core-concepts-ui';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            z-index: 1000;
            background: linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(20, 10, 30, 0.95) 100%);
        `;

        container.innerHTML = `
            <div style="
                flex: 1;
                padding: 40px;
                overflow-y: auto;
                max-width: 800px;
            ">
                <h1 style="color: #4a90e2; font-size: 36px; margin: 0 0 30px 0;">Core Kubernetes Objects</h1>
                
                <div style="color: #ddd; line-height: 1.8; font-size: 16px;">
                    ${this.getEducationalContent()}
                </div>

                <div style="margin-top: 40px; display: flex; gap: 10px;">
                    <button id="btn-back-core" style="
                        background: rgba(100, 100, 100, 0.5);
                        color: #ddd;
                        border: 1px solid #666;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                    ">← Back</button>
                    <button id="btn-next-core" style="
                        background: #4a90e2;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                    ">Next →</button>
                </div>
            </div>

            <div style="
                width: 400px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.9);
                border-left: 2px solid #4caf50;
                overflow-y: auto;
            ">
                <div id="theory-simulator-container"></div>
            </div>
        `;

        document.body.appendChild(container);

        // Setup theory simulator
        setTimeout(() => {
            try {
                this.theorySimulator = new TheorySimulator('theory-simulator-container');
            } catch (err) {
                console.error('[CoreConceptsScene] Failed to create theory simulator:', err);
            }
        }, 100);

        // Setup navigation buttons
        const backBtn = document.getElementById('btn-back-core');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (this.theorySimulator) {
                    this.theorySimulator.dispose();
                }
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: 'main-menu' } 
                }));
            });
        }

        const nextBtn = document.getElementById('btn-next-core');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.theorySimulator) {
                    this.theorySimulator.dispose();
                }
                this.learningJourneyManager.completeModule('coreConcepts');
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: 'networking' } 
                }));
            });
        }

        (scene as any).ui = container;
    }

    private static getEducationalContent(): string {
        return `
            <div style="margin-bottom: 30px;">
                <p style="font-size: 20px; color: #fff; margin-bottom: 15px;">
                    <strong>Understanding Kubernetes Core Objects</strong>
                </p>
                <p>
                    Kubernetes uses several core objects to manage containerized applications. Understanding these is essential.
                </p>
            </div>

            <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                    <strong>📦 Pods</strong>
                </p>
                <p style="margin-bottom: 10px;">
                    <strong>Pods</strong> are the smallest deployable unit in Kubernetes. A Pod can contain one or more containers 
                    that share storage and network resources.
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>Each Pod gets its own IP address</li>
                    <li>Containers in a Pod share the same network namespace</li>
                    <li>Pods are ephemeral - they can be created and destroyed</li>
                </ul>
                <p style="margin-top: 15px; color: #4caf50; font-size: 14px;">
                    <strong>Try it:</strong> Click "Create Pod" in the simulator to see how Pods work!
                </p>
            </div>

            <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                    <strong>🔄 ReplicaSets</strong>
                </p>
                <p style="margin-bottom: 10px;">
                    <strong>ReplicaSets</strong> ensure a specified number of Pod replicas are running at any given time.
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>Maintains desired number of Pods</li>
                    <li>Automatically creates new Pods if one fails</li>
                    <li>Uses label selectors to identify Pods</li>
                    <li>Usually managed by Deployments (you rarely create ReplicaSets directly)</li>
                </ul>
                <p style="margin-top: 15px; color: #4caf50; font-size: 14px;">
                    <strong>Try it:</strong> Create a Deployment and watch how it automatically creates a ReplicaSet!
                </p>
            </div>

            <div style="margin: 30px 0; padding: 20px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid #4caf50;">
                <p style="font-size: 18px; color: #4caf50; margin-bottom: 15px;">
                    <strong>🚀 Deployments</strong>
                </p>
                <p style="margin-bottom: 10px;">
                    <strong>Deployments</strong> are the recommended way to manage Pods. They provide declarative updates, 
                    rolling updates, and rollback capabilities.
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>Manages ReplicaSets, which manage Pods</li>
                    <li>Enables rolling updates without downtime</li>
                    <li>Supports rollback to previous versions</li>
                    <li>Provides self-healing capabilities</li>
                </ul>
                <p style="margin-top: 15px; color: #4caf50; font-size: 14px;">
                    <strong>Try it:</strong> Create a Deployment, scale it, update its image, and rollback to see all features!
                </p>
            </div>

            <div style="margin: 30px 0; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                <p style="font-size: 18px; color: #fff; margin-bottom: 15px;">
                    <strong>📊 The Hierarchy</strong>
                </p>
                <div style="text-align: center; font-size: 14px; color: #aaa; line-height: 2;">
                    <div style="margin-bottom: 15px;">
                        <strong style="color: #4caf50;">Deployment</strong> → 
                        <span style="color: #888;">creates/manages</span> → 
                        <strong style="color: #ffc107;">ReplicaSet</strong> → 
                        <span style="color: #888;">creates/manages</span> → 
                        <strong style="color: #4a90e2;">Pods</strong>
                    </div>
                </div>
            </div>
        `;
    }
}
