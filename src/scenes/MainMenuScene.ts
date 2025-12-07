import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { ProgressionSystem } from '../gameplay/ProgressionSystem.js';
import { LearningJourneyManager } from '../gameplay/LearningJourneyManager.js';

/**
 * Main menu scene with navigation options
 */
export class MainMenuScene {
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

        // Create menu UI
        this.createMenuUI(scene);

        return scene;
    }

    private static createMenuUI(scene: Scene): void {
        // Remove existing menu if it exists
        const existingMenu = document.getElementById('main-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Check learning journey completion
        const learningJourneyManager = new LearningJourneyManager();
        const isJourneyComplete = learningJourneyManager.isJourneyComplete();
        const nextModule = learningJourneyManager.getNextModule();
        const nextModuleName = nextModule ? this.getModuleName(nextModule) : '';

        const menuContainer = document.createElement('div');
        menuContainer.id = 'main-menu';
        menuContainer.style.cssText = `
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
            z-index: 100;
        `;

        const fundamentalsButtonStyle = isJourneyComplete 
            ? 'background: #4a90e2; color: white; cursor: pointer;'
            : 'background: rgba(100, 100, 100, 0.5); color: #888; cursor: not-allowed;';

        const fundamentalsButtonText = isJourneyComplete 
            ? 'Start Fundamentals'
            : '🔒 Complete Learning Journey First';

        menuContainer.innerHTML = `
            <div style="text-align: center;">
                <h1 style="color: #4a90e2; font-size: 48px; margin-bottom: 10px;">Kubernetes 3D Learning Game</h1>
                <p style="color: #aaa; font-size: 18px; margin-bottom: 40px; text-align: center;">
                    Master Kubernetes through interactive 3D missions
                </p>
                <div style="display: flex; flex-direction: column; gap: 15px; min-width: 300px;">
                    <button id="btn-fundamentals" style="
                        ${fundamentalsButtonStyle}
                        border: none;
                        padding: 15px 30px;
                        border-radius: 8px;
                        font-size: 18px;
                        transition: all 0.3s;
                        position: relative;
                    ">${fundamentalsButtonText}</button>
                    ${!isJourneyComplete ? `
                    <div style="
                        margin-top: 10px;
                        padding: 10px;
                        background: rgba(255, 193, 7, 0.1);
                        border: 1px solid #ffc107;
                        border-radius: 5px;
                        color: #ffc107;
                        font-size: 14px;
                        text-align: center;
                    ">
                        Complete the Learning Journey to unlock Fundamentals missions
                        ${nextModuleName ? `<br><small>Next: ${nextModuleName}</small>` : ''}
                    </div>
                    ` : ''}
                    <button id="btn-lab" style="
                        background: rgba(74, 144, 226, 0.3);
                        color: #4a90e2;
                        border: 2px solid #4a90e2;
                        padding: 15px 30px;
                        border-radius: 8px;
                        font-size: 18px;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">Open Lab Environment</button>
                    <button id="btn-challenge" style="
                        background: rgba(255, 193, 7, 0.2);
                        color: #ffc107;
                        border: 2px solid #ffc107;
                        padding: 15px 30px;
                        border-radius: 8px;
                        font-size: 18px;
                        cursor: pointer;
                        transition: all 0.3s;
                        display: none;
                        position: relative;
                        animation: challengePulse 2s infinite;
                    ">⚡ Challenge Mode</button>
                    <button id="btn-learning-journey" style="
                        background: rgba(156, 39, 176, 0.3);
                        color: #9c27b0;
                        border: 2px solid #9c27b0;
                        padding: 15px 30px;
                        border-radius: 8px;
                        font-size: 18px;
                        cursor: pointer;
                        transition: all 0.3s;
                    ">📚 Learning Journey</button>
                </div>
            </div>
        `;

        document.body.appendChild(menuContainer);

        // Check if Challenge Mode should be visible
        const progressionSystem = new ProgressionSystem();
        const challengeBtn = document.getElementById('btn-challenge');
        if (challengeBtn && progressionSystem.getLevel() >= 5) {
            challengeBtn.style.display = 'block';
            
            // Add pulse animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes challengePulse {
                    0%, 100% { box-shadow: 0 0 10px rgba(255, 193, 7, 0.5); }
                    50% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.8); }
                }
            `;
            if (!document.head.querySelector('#challenge-pulse-animation')) {
                style.id = 'challenge-pulse-animation';
                document.head.appendChild(style);
            }
        }

        // Add button event listeners
        const fundamentalsBtn = document.getElementById('btn-fundamentals');
        const labBtn = document.getElementById('btn-lab');

        if (fundamentalsBtn) {
            const newBtn = fundamentalsBtn.cloneNode(true) as HTMLElement;
            fundamentalsBtn.parentNode?.replaceChild(newBtn, fundamentalsBtn);
            
            newBtn.addEventListener('click', () => {
                menuContainer.style.display = 'none';
                if (!isJourneyComplete) {
                    // Start learning journey instead
                    document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'intro' } }));
                } else {
                    document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'fundamentals' } }));
                }
            });
        }

        if (labBtn) {
            const newBtn = labBtn.cloneNode(true) as HTMLElement;
            labBtn.parentNode?.replaceChild(newBtn, labBtn);
            
            newBtn.addEventListener('click', () => {
                menuContainer.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'lab' } }));
            });
        }

        if (challengeBtn) {
            const newBtn = challengeBtn.cloneNode(true) as HTMLElement;
            challengeBtn.parentNode?.replaceChild(newBtn, challengeBtn);
            
            newBtn.addEventListener('click', () => {
                menuContainer.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'challenge' } }));
            });
        }

        const learningJourneyBtn = document.getElementById('btn-learning-journey');
        if (learningJourneyBtn) {
            const newBtn = learningJourneyBtn.cloneNode(true) as HTMLElement;
            learningJourneyBtn.parentNode?.replaceChild(newBtn, learningJourneyBtn);
            
            newBtn.addEventListener('click', async () => {
                const { LearningJourneyMap } = await import('../ui/LearningJourneyMap.js');
                const journeyMap = new LearningJourneyMap();
                journeyMap.show();
            });
        }

        // Store reference in scene metadata
        (scene as any).menuContainer = menuContainer;
    }

    private static getModuleName(module: string): string {
        const names: Record<string, string> = {
            'intro': 'Introduction',
            'kubernetesOverview': 'Kubernetes Overview',
            'containers': 'Containers Basics',
            'orchestration': 'Container Orchestration',
            'architecture': 'Kubernetes Architecture',
            'setup': 'Kubernetes Setup',
            'yaml': 'YAML Basics',
            'coreConcepts': 'Core Concepts',
            'networking': 'Networking',
            'microservices': 'Microservices'
        };
        return names[module] || module;
    }
}
