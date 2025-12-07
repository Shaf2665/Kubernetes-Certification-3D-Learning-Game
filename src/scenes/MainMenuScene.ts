import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { ProgressionSystem } from '../gameplay/ProgressionSystem.js';

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
            background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
            z-index: 50;
            pointer-events: auto;
        `;

        menuContainer.innerHTML = `
            <h1 style="color: #4a90e2; font-size: 48px; margin-bottom: 10px; text-align: center;">
                Kubernetes 3D Learning Game
            </h1>
            <p style="color: #aaa; font-size: 18px; margin-bottom: 40px; text-align: center;">
                Master Kubernetes through interactive 3D missions
            </p>
            <div style="display: flex; flex-direction: column; gap: 15px; min-width: 300px;">
                <button id="btn-fundamentals" style="
                    background: #4a90e2;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 8px;
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.3s;
                ">Start Fundamentals</button>
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

        fundamentalsBtn?.addEventListener('click', () => {
            menuContainer.style.display = 'none';
            document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'fundamentals' } }));
        });

        labBtn?.addEventListener('click', () => {
            menuContainer.style.display = 'none';
            document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'lab' } }));
        });

        challengeBtn?.addEventListener('click', () => {
            menuContainer.style.display = 'none';
            document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'challenge' } }));
        });

        // Store reference in scene metadata
        (scene as any).menuContainer = menuContainer;
    }
}

