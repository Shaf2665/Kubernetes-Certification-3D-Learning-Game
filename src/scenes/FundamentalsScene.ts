import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { ClusterSimulator } from '../kubernetes/ClusterSimulator.js';
import { MissionsManager } from '../gameplay/MissionsManager.js';

/**
 * Main fundamentals learning scene
 */
export class FundamentalsScene {
    private static clusterSimulator: ClusterSimulator | null = null;
    private static missionsManager: MissionsManager | null = null;

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
        groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.25);
        ground.material = groundMaterial;

        // Initialize cluster simulator
        this.clusterSimulator = new ClusterSimulator(scene);
        await this.clusterSimulator.init();

        // Initialize missions manager
        this.missionsManager = new MissionsManager(scene, this.clusterSimulator);
        await this.missionsManager.init();

        // Create HUD
        this.createHUD(scene);

        return scene;
    }

    private static createHUD(scene: Scene): void {
        const hud = document.createElement('div');
        hud.id = 'fundamentals-hud';
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
                    <h2 style="color: #4a90e2; margin: 0;">Kubernetes Fundamentals</h2>
                    <button id="btn-back-menu" style="
                        background: rgba(74, 144, 226, 0.3);
                        color: #4a90e2;
                        border: 1px solid #4a90e2;
                        padding: 8px 16px;
                        border-radius: 5px;
                        cursor: pointer;
                        pointer-events: auto;
                    ">Back to Menu</button>
                </div>
                <div id="mission-info" style="margin-top: 15px; color: #fff;">
                    <p style="margin: 5px 0;"><strong>Current Mission:</strong> <span id="mission-name">Loading...</span></p>
                    <p style="margin: 5px 0;"><strong>Progress:</strong> <span id="mission-progress">0/15</span></p>
                </div>
            </div>
        `;

        document.body.appendChild(hud);

        const backBtn = document.getElementById('btn-back-menu');
        backBtn?.addEventListener('click', () => {
            hud.style.display = 'none';
            document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'main-menu' } }));
        });

        (scene as any).hud = hud;
    }

    public static getClusterSimulator(): ClusterSimulator | null {
        return this.clusterSimulator;
    }

    public static getMissionsManager(): MissionsManager | null {
        return this.missionsManager;
    }
}

