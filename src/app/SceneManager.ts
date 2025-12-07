import { Engine, Scene } from '@babylonjs/core';
import { MainMenuScene } from '../scenes/MainMenuScene.js';
import { FundamentalsScene } from '../scenes/FundamentalsScene.js';
import { LabEnvironmentScene } from '../scenes/LabEnvironmentScene.js';
import { ChallengeModeScene } from '../scenes/ChallengeModeScene.js';
import { IntroductionScene } from '../scenes/IntroductionScene.js';
import { KubernetesOverviewScene } from '../scenes/KubernetesOverviewScene.js';
import { ContainersOverviewScene } from '../scenes/ContainersOverviewScene.js';
import { OrchestrationOverviewScene } from '../scenes/OrchestrationOverviewScene.js';
import { ArchitectureScene } from '../scenes/ArchitectureScene.js';
import { KubernetesSetupScene } from '../scenes/KubernetesSetupScene.js';
import { YAMLIntroScene } from '../scenes/YAMLIntroScene.js';
import { CoreConceptsScene } from '../scenes/CoreConceptsScene.js';
import { NetworkingScene } from '../scenes/NetworkingScene.js';
import { MicroservicesAnimationScene } from '../scenes/MicroservicesAnimationScene.js';

export type SceneType = 'main-menu' | 'fundamentals' | 'lab' | 'challenge' | 
    'intro' | 'kubernetes-overview' | 'containers' | 'orchestration' | 
    'architecture' | 'setup' | 'yaml' | 'core-concepts' | 'networking' | 'microservices';

/**
 * Manages scene transitions and lifecycle
 */
export class SceneManager {
    private engine: Engine;
    private currentScene: Scene | null = null;
    private currentSceneType: SceneType = 'main-menu';
    private scenes: Map<SceneType, Scene> = new Map();

    constructor(engine: Engine) {
        this.engine = engine;
    }

    async init(): Promise<void> {
        // Create main menu scene first
        await this.loadScene('main-menu');
        
        // Listen for scene change events
        document.addEventListener('scene-change', async (e: any) => {
            const sceneType = e.detail?.scene;
            if (sceneType) {
                await this.loadScene(sceneType as SceneType);
            }
        });
    }

    async loadScene(sceneType: SceneType): Promise<void> {
        console.log(`[SceneManager] Loading scene: ${sceneType}`);
        
        try {
            // Dispose current scene
            if (this.currentScene) {
                console.log('[SceneManager] Disposing current scene');
                this.currentScene.dispose();
            }

            // Always dispose and recreate scenes to prevent stale state
            // Remove old scene from map if it exists
            if (this.scenes.has(sceneType)) {
                const oldScene = this.scenes.get(sceneType);
                if (oldScene) {
                    console.log(`[SceneManager] Disposing old ${sceneType} scene`);
                    oldScene.dispose();
                }
                this.scenes.delete(sceneType);
            }

            // Create new scene
            console.log(`[SceneManager] Creating new scene: ${sceneType}`);
            let newScene: Scene;
            
            switch (sceneType) {
                case 'main-menu':
                    newScene = await MainMenuScene.create(this.engine);
                    break;
                case 'fundamentals':
                    newScene = await FundamentalsScene.create(this.engine);
                    break;
                case 'lab':
                    newScene = await LabEnvironmentScene.create(this.engine);
                    break;
                case 'challenge':
                    newScene = await ChallengeModeScene.create(this.engine);
                    break;
                case 'intro':
                    newScene = await IntroductionScene.create(this.engine);
                    break;
                case 'kubernetes-overview':
                    newScene = await KubernetesOverviewScene.create(this.engine);
                    break;
                case 'containers':
                    newScene = await ContainersOverviewScene.create(this.engine);
                    break;
                case 'orchestration':
                    newScene = await OrchestrationOverviewScene.create(this.engine);
                    break;
                case 'architecture':
                    newScene = await ArchitectureScene.create(this.engine);
                    break;
                case 'setup':
                    newScene = await KubernetesSetupScene.create(this.engine);
                    break;
                case 'yaml':
                    newScene = await YAMLIntroScene.create(this.engine);
                    break;
                case 'core-concepts':
                    newScene = await CoreConceptsScene.create(this.engine);
                    break;
                case 'networking':
                    newScene = await NetworkingScene.create(this.engine);
                    break;
                case 'microservices':
                    newScene = await MicroservicesAnimationScene.create(this.engine);
                    break;
                default:
                    throw new Error(`Unknown scene type: ${sceneType}`);
            }

            this.scenes.set(sceneType, newScene);
            this.currentScene = newScene;
            this.currentSceneType = sceneType;
            console.log(`[SceneManager] Scene ${sceneType} loaded successfully`);
        } catch (err) {
            console.error(`[SceneManager] Error loading scene ${sceneType}:`, err);
            throw err;
        }
    }

    getCurrentScene(): Scene | null {
        return this.currentScene;
    }

    getCurrentSceneType(): SceneType {
        return this.currentSceneType;
    }

    dispose(): void {
        this.scenes.forEach(scene => scene.dispose());
        this.scenes.clear();
        this.currentScene = null;
    }
}

