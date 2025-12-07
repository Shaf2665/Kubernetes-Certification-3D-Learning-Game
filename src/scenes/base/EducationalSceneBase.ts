import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { LearningJourneyManager } from '../../gameplay/LearningJourneyManager.js';

export interface EducationalSceneConfig {
    title: string;
    moduleName: keyof import('../../gameplay/LearningJourneyManager.js').LearningJourneyProgress;
    nextScene: string;
    content: string;
    showBackButton?: boolean;
}

/**
 * Base class for educational scenes in the Learning Journey
 */
export abstract class EducationalSceneBase {
    protected static learningJourneyManager: LearningJourneyManager;

    static async create(engine: Engine, config: EducationalSceneConfig): Promise<Scene> {
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
        this.createEducationalUI(scene, config);

        return scene;
    }

    protected static createEducationalUI(scene: Scene, config: EducationalSceneConfig): void {
        const existingUI = document.getElementById('educational-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const container = document.createElement('div');
        container.id = 'educational-ui';
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
                max-width: 1000px;
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
                    margin: 0 0 30px 0;
                    text-align: center;
                ">${config.title}</h1>
                
                <div style="color: #ddd; line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
                    ${config.content}
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                    ${config.showBackButton ? `
                    <button id="btn-back" style="
                        background: rgba(100, 100, 100, 0.5);
                        color: #ddd;
                        border: 1px solid #666;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='rgba(100, 100, 100, 0.7)'" 
                       onmouseout="this.style.background='rgba(100, 100, 100, 0.5)'">
                        ← Back
                    </button>
                    ` : '<div></div>'}
                    <button id="btn-next" style="
                        background: #4a90e2;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
                    " onmouseover="this.style.background='#5aa0f2'; this.style.transform='scale(1.05)'" 
                       onmouseout="this.style.background='#4a90e2'; this.style.transform='scale(1)'">
                        Next →
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Setup buttons
        const nextBtn = document.getElementById('btn-next');
        if (nextBtn) {
            const newNextBtn = nextBtn.cloneNode(true) as HTMLElement;
            nextBtn.parentNode?.replaceChild(newNextBtn, nextBtn);
            
            newNextBtn.addEventListener('click', () => {
                // Mark module as complete
                this.learningJourneyManager.completeModule(config.moduleName);
                
                // Navigate to next scene
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: config.nextScene } 
                }));
            });
        }

        if (config.showBackButton) {
            const backBtn = document.getElementById('btn-back');
            if (backBtn) {
                const newBackBtn = backBtn.cloneNode(true) as HTMLElement;
                backBtn.parentNode?.replaceChild(newBackBtn, backBtn);
                
                newBackBtn.addEventListener('click', () => {
                    container.style.display = 'none';
                    document.dispatchEvent(new CustomEvent('scene-change', { 
                        detail: { scene: 'main-menu' } 
                    }));
                });
            }
        }

        (scene as any).ui = container;
    }
}

