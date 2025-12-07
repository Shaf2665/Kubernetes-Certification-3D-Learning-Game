import { Engine } from '@babylonjs/core';
import { SceneManager } from './SceneManager.js';
import { UIManager } from './UIManager.js';
import { InputManager } from './InputManager.js';

/**
 * Main game class that orchestrates all systems
 */
export class Game {
    private engine: Engine;
    private sceneManager: SceneManager;
    private uiManager: UIManager;
    private inputManager: InputManager;
    private canvas: HTMLCanvasElement;

    constructor() {
        const canvasElement = document.getElementById('gameCanvas');
        if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
            throw new Error('Canvas element not found');
        }
        this.canvas = canvasElement;

        // Initialize Babylon.js engine
        this.engine = new Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });

        // Initialize managers
        this.sceneManager = new SceneManager(this.engine);
        this.uiManager = new UIManager();
        this.inputManager = new InputManager(this.canvas, this.sceneManager);
    }

    async init(): Promise<void> {
        // Initialize UI
        await this.uiManager.init();

        // Initialize scene manager
        await this.sceneManager.init();

        // Start render loop
        this.startRenderLoop();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // Handle scene changes - show/hide menu and cleanup HUDs
        document.addEventListener('scene-change', (e: any) => {
            const sceneType = e.detail?.scene;
            const menuContainer = document.getElementById('main-menu');
            
            if (sceneType === 'main-menu') {
                if (menuContainer) {
                    menuContainer.style.display = 'flex';
                }
                // Hide other HUDs
                const fundamentalsHud = document.getElementById('fundamentals-hud');
                const labHud = document.getElementById('lab-hud');
                if (fundamentalsHud) fundamentalsHud.style.display = 'none';
                if (labHud) labHud.style.display = 'none';
            } else {
                if (menuContainer) {
                    menuContainer.style.display = 'none';
                }
                // Hide HUDs from other scenes
                if (sceneType === 'fundamentals') {
                    const labHud = document.getElementById('lab-hud');
                    if (labHud) labHud.style.display = 'none';
                } else if (sceneType === 'lab') {
                    const fundamentalsHud = document.getElementById('fundamentals-hud');
                    if (fundamentalsHud) fundamentalsHud.style.display = 'none';
                }
            }
        });
    }

    private startRenderLoop(): void {
        this.engine.runRenderLoop(() => {
            const currentScene = this.sceneManager.getCurrentScene();
            if (currentScene) {
                currentScene.render();
            }
        });
    }

    public getEngine(): Engine {
        return this.engine;
    }

    public getSceneManager(): SceneManager {
        return this.sceneManager;
    }

    public getUIManager(): UIManager {
        return this.uiManager;
    }

    public getInputManager(): InputManager {
        return this.inputManager;
    }

    public dispose(): void {
        this.sceneManager.dispose();
        this.uiManager.dispose();
        this.engine.dispose();
    }
}

