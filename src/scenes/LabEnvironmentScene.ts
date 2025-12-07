import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { ClusterSimulator } from '../kubernetes/ClusterSimulator.js';
import { TerminalUI } from '../ui/TerminalUI.js';

/**
 * Lab environment scene with kubectl terminal
 */
export class LabEnvironmentScene {
    private static clusterSimulator: ClusterSimulator | null = null;
    private static terminalUI: TerminalUI | null = null;

    static async create(engine: Engine): Promise<Scene> {
        const scene = new Scene(engine);
        
        // Create camera
        const camera = new ArcRotateCamera(
            'camera',
            -Math.PI / 2,
            Math.PI / 3,
            20,
            Vector3.Zero(),
            scene
        );
        camera.attachControl(engine.getRenderingCanvas()!, true);
        camera.lowerRadiusLimit = 5;
        camera.upperRadiusLimit = 50;

        // Create lights
        const hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
        hemiLight.intensity = 0.6;
        
        const dirLight = new DirectionalLight('dirLight', new Vector3(-1, -1, -1), scene);
        dirLight.intensity = 0.8;

        // Create ground
        const ground = MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, scene);
        const groundMaterial = new StandardMaterial('groundMat', scene);
        groundMaterial.diffuseColor = new Color3(0.15, 0.15, 0.2);
        ground.material = groundMaterial;

        // Initialize cluster simulator
        this.clusterSimulator = new ClusterSimulator(scene);
        await this.clusterSimulator.init();

        // Initialize terminal UI
        this.terminalUI = new TerminalUI(this.clusterSimulator);
        await this.terminalUI.init();

        // Create lab HUD
        this.createLabHUD(scene);

        return scene;
    }

    private static createLabHUD(scene: Scene): void {
        const hud = document.createElement('div');
        hud.id = 'lab-hud';
        hud.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            pointer-events: none;
            z-index: 100;
        `;

        hud.innerHTML = `
            <div style="background: rgba(0, 0, 0, 0.7); padding: 15px; border-radius: 8px; border: 2px solid #4a90e2;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="color: #4a90e2; margin: 0;">Lab Environment</h2>
                    <button id="btn-back-menu-lab" style="
                        background: rgba(74, 144, 226, 0.3);
                        color: #4a90e2;
                        border: 1px solid #4a90e2;
                        padding: 8px 16px;
                        border-radius: 5px;
                        cursor: pointer;
                        pointer-events: auto;
                    ">Back to Menu</button>
                </div>
                <p style="color: #aaa; margin: 10px 0 0 0; font-size: 14px;">
                    Press <code style="background: rgba(74, 144, 226, 0.2); padding: 2px 6px; border-radius: 3px;">\`</code> to toggle terminal
                </p>
            </div>
        `;

        document.body.appendChild(hud);

        const backBtn = document.getElementById('btn-back-menu-lab');
        backBtn?.addEventListener('click', () => {
            hud.style.display = 'none';
            document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'main-menu' } }));
        });

        (scene as any).hud = hud;
    }

    public static getClusterSimulator(): ClusterSimulator | null {
        return this.clusterSimulator;
    }

    public static getTerminalUI(): TerminalUI | null {
        return this.terminalUI;
    }
}

