import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { LearningJourneyManager } from '../gameplay/LearningJourneyManager.js';
import { YAMLEditor } from '../ui/YAMLEditor.js';

/**
 * YAML Introduction scene with interactive YAML editor
 */
export class YAMLIntroScene {
    private static learningJourneyManager: LearningJourneyManager;
    private static yamlEditor: YAMLEditor | null = null;

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
        this.createYAMLUI(scene);

        return scene;
    }

    private static createYAMLUI(scene: Scene): void {
        const existingUI = document.getElementById('yaml-intro-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const container = document.createElement('div');
        container.id = 'yaml-intro-ui';
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
                max-width: 1200px;
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
                ">YAML Fundamentals</h1>
                
                <div style="color: #ddd; line-height: 1.8; font-size: 16px; margin-bottom: 30px;">
                    <div style="margin-bottom: 30px;">
                        <p style="font-size: 20px; color: #fff; margin-bottom: 15px;">
                            <strong>What is YAML?</strong>
                        </p>
                        <p>
                            YAML (YAML Ain't Markup Language) is a human-readable data serialization format. 
                            Kubernetes uses YAML files to define resources like Pods, Deployments, and Services.
                        </p>
                    </div>

                    <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                        <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                            <strong>YAML Rules</strong>
                        </p>
                        <ul style="margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 10px;"><strong>Indentation matters:</strong> Use spaces (2 spaces recommended), not tabs</li>
                            <li style="margin-bottom: 10px;"><strong>Key-value pairs:</strong> Use colons to separate keys from values</li>
                            <li style="margin-bottom: 10px;"><strong>Lists:</strong> Use dashes (-) for array items</li>
                            <li style="margin-bottom: 10px;"><strong>Nested objects:</strong> Indent child keys under parent keys</li>
                            <li style="margin-bottom: 10px;"><strong>Case sensitive:</strong> Keys and values are case-sensitive</li>
                        </ul>
                    </div>

                    <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                        <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                            <strong>📝 Exercise: Fix the YAML</strong>
                        </p>
                        <p style="margin-bottom: 15px;">
                            The YAML below has errors. Fix them to make it valid:
                        </p>
                    </div>

                    <div id="yaml-editor-container"></div>

                    <div style="margin-top: 20px; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                        <p style="font-size: 14px; color: #aaa; margin-bottom: 10px;">
                            <strong>Example Pod YAML:</strong>
                        </p>
                        <pre style="
                            background: rgba(0, 0, 0, 0.5);
                            padding: 15px;
                            border-radius: 5px;
                            font-family: 'Courier New', monospace;
                            font-size: 13px;
                            color: #00ff00;
                            overflow-x: auto;
                        ">apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80</pre>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                    <button id="btn-back-yaml" style="
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
                    <button id="btn-next-yaml" style="
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

        // Create YAML editor
        setTimeout(() => {
            try {
                this.yamlEditor = new YAMLEditor('yaml-editor-container');
                
                // Set initial broken YAML for exercise
                const brokenYAML = `apiVersion: v1
kind: Pod
metadata:
name: my-pod  # Missing indentation
spec:
  containers:
- name: nginx  # Wrong indentation
    image: nginx:latest
  ports:  # Wrong indentation
    - containerPort: 80`;

                this.yamlEditor.setValue(brokenYAML);
            } catch (err) {
                console.error('[YAMLIntroScene] Failed to create YAML editor:', err);
            }
        }, 100);

        // Setup buttons
        const nextBtn = document.getElementById('btn-next-yaml');
        if (nextBtn) {
            const newNextBtn = nextBtn.cloneNode(true) as HTMLElement;
            nextBtn.parentNode?.replaceChild(newNextBtn, nextBtn);
            
            newNextBtn.addEventListener('click', () => {
                // Mark module as complete
                this.learningJourneyManager.completeModule('yaml');
                
                // Navigate to next scene
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: 'core-concepts' } 
                }));
            });
        }

        const backBtn = document.getElementById('btn-back-yaml');
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

        (scene as any).ui = container;
    }
}

