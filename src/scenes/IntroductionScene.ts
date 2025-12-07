import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { LearningJourneyManager } from '../gameplay/LearningJourneyManager.js';

/**
 * Introduction scene - First screen in the Learning Journey
 */
export class IntroductionScene {
    private static learningJourneyManager: LearningJourneyManager;

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
        this.createIntroductionUI(scene);

        return scene;
    }

    private static createIntroductionUI(scene: Scene): void {
        // Remove existing UI if it exists
        const existingUI = document.getElementById('introduction-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const container = document.createElement('div');
        container.id = 'introduction-ui';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(20, 10, 30, 0.95) 100%);
            z-index: 1000;
            overflow-y: auto;
            padding: 40px;
        `;

        container.innerHTML = `
            <div style="
                max-width: 900px;
                width: 100%;
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #4a90e2;
                border-radius: 12px;
                padding: 40px;
                backdrop-filter: blur(10px);
            ">
                <h1 style="
                    color: #4a90e2;
                    font-size: 36px;
                    margin: 0 0 20px 0;
                    text-align: center;
                ">🚀 Welcome to Kubernetes 3D Learning Game</h1>
                
                <div style="color: #ddd; line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
                    <p style="font-size: 18px; color: #fff; margin-bottom: 15px;">
                        <strong>What is this game?</strong>
                    </p>
                    <p>
                        This is an interactive 3D learning experience designed to teach you Kubernetes fundamentals through hands-on practice. 
                        You'll learn by doing, visualizing concepts in 3D, and completing missions that build real-world skills.
                    </p>
                    
                    <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                        <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                            <strong>✨ What You'll Learn:</strong>
                        </p>
                        <ul style="margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 10px;">Kubernetes architecture and core concepts</li>
                            <li style="margin-bottom: 10px;">Pods, Deployments, Services, and more</li>
                            <li style="margin-bottom: 10px;">Container orchestration principles</li>
                            <li style="margin-bottom: 10px;">Networking and service discovery</li>
                            <li style="margin-bottom: 10px;">Hands-on kubectl commands</li>
                        </ul>
                    </div>

                    <div style="margin: 30px 0;">
                        <p style="font-size: 18px; color: #fff; margin-bottom: 15px;">
                            <strong>🎮 How the Game Works:</strong>
                        </p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                            <div style="padding: 15px; background: rgba(74, 144, 226, 0.1); border-radius: 8px;">
                                <strong style="color: #4a90e2;">📚 Learning Journey</strong>
                                <p style="margin: 8px 0 0 0; font-size: 14px;">Complete educational modules to build your foundation</p>
                            </div>
                            <div style="padding: 15px; background: rgba(74, 144, 226, 0.1); border-radius: 8px;">
                                <strong style="color: #4a90e2;">🎯 Missions</strong>
                                <p style="margin: 8px 0 0 0; font-size: 14px;">Hands-on challenges that teach real Kubernetes skills</p>
                            </div>
                            <div style="padding: 15px; background: rgba(74, 144, 226, 0.1); border-radius: 8px;">
                                <strong style="color: #4a90e2;">⭐ XP & Rewards</strong>
                                <p style="margin: 8px 0 0 0; font-size: 14px;">Earn experience points and unlock achievements</p>
                            </div>
                            <div style="padding: 15px; background: rgba(74, 144, 226, 0.1); border-radius: 8px;">
                                <strong style="color: #4a90e2;">🏆 Challenges</strong>
                                <p style="margin: 8px 0 0 0; font-size: 14px;">Timed challenges to test your skills (unlocked at Level 5)</p>
                            </div>
                        </div>
                    </div>

                    <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                        <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                            <strong>💡 Key Features:</strong>
                        </p>
                        <ul style="margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 8px;"><strong>Learning-by-doing:</strong> Practice real kubectl commands in a safe environment</li>
                            <li style="margin-bottom: 8px;"><strong>3D Visualization:</strong> See Kubernetes objects come to life in 3D</li>
                            <li style="margin-bottom: 8px;"><strong>Story-based Progression:</strong> Follow a narrative as you learn</li>
                            <li style="margin-bottom: 8px;"><strong>Hands-on Labs:</strong> Experiment without breaking anything</li>
                        </ul>
                    </div>
                </div>

                <div style="display: flex; justify-content: center; margin-top: 30px;">
                    <button id="btn-continue-intro" style="
                        background: #4a90e2;
                        color: white;
                        border: none;
                        padding: 15px 40px;
                        border-radius: 8px;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
                    " onmouseover="this.style.background='#5aa0f2'; this.style.transform='scale(1.05)'" 
                       onmouseout="this.style.background='#4a90e2'; this.style.transform='scale(1)'">
                        Continue to Learning Journey →
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Setup continue button
        const continueBtn = document.getElementById('btn-continue-intro');
        if (continueBtn) {
            const newBtn = continueBtn.cloneNode(true) as HTMLElement;
            continueBtn.parentNode?.replaceChild(newBtn, continueBtn);
            
            newBtn.addEventListener('click', () => {
                // Mark intro as complete
                this.learningJourneyManager.completeModule('intro');
                
                // Navigate to Kubernetes Overview
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: 'kubernetes-overview' } 
                }));
            });
        }

        (scene as any).ui = container;
    }
}

