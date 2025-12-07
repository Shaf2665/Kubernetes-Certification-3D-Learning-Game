import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { ClusterSimulator } from '../kubernetes/ClusterSimulator.js';
import { MissionsManager } from '../gameplay/MissionsManager.js';
import { TerminalUI } from '../ui/TerminalUI.js';

/**
 * Main fundamentals learning scene
 */
export class FundamentalsScene {
    private static clusterSimulator: ClusterSimulator | null = null;
    private static missionsManager: MissionsManager | null = null;
    private static terminalUI: TerminalUI | null = null;

    static async create(engine: Engine): Promise<Scene> {
        console.log('[FundamentalsScene] Initializing FundamentalsScene...');
        
        // Reset static variables to prevent stale references
        this.clusterSimulator = null;
        this.missionsManager = null;
        this.terminalUI = null;
        
        const scene = new Scene(engine);
        
        try {
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

            // Create HUD FIRST (before missions manager so DOM elements exist)
            console.log('[FundamentalsScene] Creating HUD...');
            this.createHUD(scene);

            // Initialize cluster simulator
            console.log('[FundamentalsScene] Initializing ClusterSimulator...');
            this.clusterSimulator = new ClusterSimulator(scene);
            try {
                await this.clusterSimulator.init();
                console.log('[FundamentalsScene] ClusterSimulator initialized successfully');
            } catch (err) {
                console.error('[FundamentalsScene] ClusterSimulator init error:', err);
                // Continue even if simulator fails
            }

            // Initialize terminal UI for Fundamentals scene
            console.log('[FundamentalsScene] Initializing TerminalUI...');
            if (this.clusterSimulator) {
                try {
                    this.terminalUI = new TerminalUI(this.clusterSimulator);
                    await this.terminalUI.init();
                    console.log('[FundamentalsScene] TerminalUI initialized successfully');
                } catch (err) {
                    console.error('[FundamentalsScene] TerminalUI init error:', err);
                    // Continue even if terminal fails
                }
            }

            // Initialize missions manager AFTER HUD is created
            console.log('[FundamentalsScene] Initializing MissionsManager...');
            this.missionsManager = new MissionsManager(scene, this.clusterSimulator);
            try {
                await this.missionsManager.init();
                console.log('[FundamentalsScene] MissionsManager initialized successfully');
                
                // Update display after missions are loaded
                this.missionsManager.updateMissionDisplay();
            } catch (err) {
                console.error('[FundamentalsScene] MissionsManager init error:', err);
                // Show error in UI
                const missionNameEl = document.getElementById('mission-name');
                if (missionNameEl) {
                    missionNameEl.textContent = 'Error loading missions';
                }
            }

            console.log('[FundamentalsScene] FundamentalsScene loaded successfully');
        } catch (err) {
            console.error('[FundamentalsScene] Scene creation error:', err);
            // Still return scene even if initialization fails
        }

        return scene;
    }

    private static createHUD(scene: Scene): void {
        // Remove existing HUD if it exists
        const existingHud = document.getElementById('fundamentals-hud');
        if (existingHud) {
            existingHud.remove();
        }

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
            <div style="background: rgba(0, 0, 0, 0.85); padding: 20px; border-radius: 8px; border: 2px solid #4a90e2; max-width: 800px; backdrop-filter: blur(10px);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="color: #4a90e2; margin: 0; font-size: 24px;">Kubernetes Fundamentals</h2>
                    <button id="btn-back-menu" style="
                        background: rgba(74, 144, 226, 0.3);
                        color: #4a90e2;
                        border: 1px solid #4a90e2;
                        padding: 8px 16px;
                        border-radius: 5px;
                        cursor: pointer;
                        pointer-events: auto;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='rgba(74, 144, 226, 0.5)'" onmouseout="this.style.background='rgba(74, 144, 226, 0.3)'">Back to Menu</button>
                </div>
                
                <div id="mission-info" style="color: #fff;">
                    <div style="margin-bottom: 15px;">
                        <p style="margin: 5px 0; font-size: 14px; color: #aaa;"><strong>Progress:</strong> <span id="mission-progress">0/15</span></p>
                        <h3 id="mission-title" style="color: #4a90e2; margin: 10px 0; font-size: 20px;">Loading...</h3>
                        <p id="mission-description" style="margin: 8px 0; line-height: 1.6; color: #ddd;">Loading mission details...</p>
                    </div>
                    
                    <div id="mission-explanation-section" style="margin: 15px 0; padding: 12px; background: rgba(74, 144, 226, 0.1); border-left: 3px solid #4a90e2; border-radius: 4px; display: none;">
                        <h4 style="color: #4a90e2; margin: 0 0 8px 0; font-size: 16px;">📚 What You Will Learn</h4>
                        <p id="mission-explanation" style="margin: 0; line-height: 1.6; color: #ccc; font-size: 14px;"></p>
                    </div>
                    
                    <div id="mission-objectives-section" style="margin: 15px 0; display: none;">
                        <h4 style="color: #4a90e2; margin: 0 0 8px 0; font-size: 16px;">🎯 Objectives</h4>
                        <ul id="mission-objectives" style="margin: 0; padding-left: 20px; color: #ddd; line-height: 1.8; font-size: 14px;"></ul>
                    </div>
                    
                    <div id="mission-hint-section" style="margin: 15px 0; padding: 12px; background: rgba(255, 193, 7, 0.1); border-left: 3px solid #ffc107; border-radius: 4px; display: none;">
                        <h4 style="color: #ffc107; margin: 0 0 8px 0; font-size: 16px;">💡 Hint</h4>
                        <p id="mission-hint" style="margin: 0; line-height: 1.6; color: #ffd54f; font-size: 14px;"></p>
                        <div id="mission-example" style="margin-top: 8px; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 4px; font-family: 'Courier New', monospace; font-size: 13px; color: #4a90e2; display: none;">
                            <strong style="color: #4a90e2;">Example:</strong> <code id="mission-example-command" style="color: #00ff00;"></code>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button id="btn-show-hint" style="
                            background: rgba(255, 193, 7, 0.2);
                            color: #ffc107;
                            border: 1px solid #ffc107;
                            padding: 8px 16px;
                            border-radius: 5px;
                            cursor: pointer;
                            pointer-events: auto;
                            font-size: 14px;
                            transition: all 0.3s;
                            display: none;
                        " onmouseover="this.style.background='rgba(255, 193, 7, 0.3)'" onmouseout="this.style.background='rgba(255, 193, 7, 0.2)'">💡 Show Hint</button>
                        <button id="btn-why-matters" style="
                            background: rgba(74, 144, 226, 0.2);
                            color: #4a90e2;
                            border: 1px solid #4a90e2;
                            padding: 8px 16px;
                            border-radius: 5px;
                            cursor: pointer;
                            pointer-events: auto;
                            font-size: 14px;
                            transition: all 0.3s;
                        " onmouseover="this.style.background='rgba(74, 144, 226, 0.3)'" onmouseout="this.style.background='rgba(74, 144, 226, 0.2)'">💡 Why This Matters</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(hud);

        const backBtn = document.getElementById('btn-back-menu');
        if (backBtn) {
            // Remove old listeners by cloning
            const newBtn = backBtn.cloneNode(true) as HTMLElement;
            backBtn.parentNode?.replaceChild(newBtn, backBtn);
            
            newBtn.addEventListener('click', () => {
                hud.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'main-menu' } }));
            });
        }

        (scene as any).hud = hud;
    }

    public static getClusterSimulator(): ClusterSimulator | null {
        return this.clusterSimulator;
    }

    public static getMissionsManager(): MissionsManager | null {
        return this.missionsManager;
    }

    public static getTerminalUI(): TerminalUI | null {
        return this.terminalUI;
    }
}

