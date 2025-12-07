import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { LearningJourneyManager } from '../gameplay/LearningJourneyManager.js';
import { MicroservicesStoryboard } from '../animations/MicroservicesStoryboard.js';
import { StoryboardControls } from '../ui/StoryboardControls.js';

/**
 * Microservices Animation scene with interactive storyboard
 */
export class MicroservicesAnimationScene {
    private static storyboard: MicroservicesStoryboard | null = null;
    private static controls: StoryboardControls | null = null;
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
        
        // Initialize storyboard
        this.storyboard = new MicroservicesStoryboard(scene);
        this.setupStoryboard();
        this.setup3DComponents();

        // Create UI
        this.createUI(scene);

        return scene;
    }

    private static setup3DComponents(): void {
        if (!this.storyboard) return;

        // Monolith
        this.storyboard.createService('monolith', new Vector3(0, 2, 0), new Color3(0.8, 0.2, 0.2), 2);

        // Microservices
        this.storyboard.createService('frontend', new Vector3(-6, 2, 0), new Color3(0.29, 0.56, 0.89), 1);
        this.storyboard.createService('apiGateway', new Vector3(-3, 2, 0), new Color3(0.29, 0.56, 0.89), 1);
        this.storyboard.createService('backend', new Vector3(0, 2, 0), new Color3(0.3, 0.8, 0.3), 1);
        this.storyboard.createService('auth', new Vector3(3, 2, 0), new Color3(1, 0.76, 0.03), 1);
        this.storyboard.createService('database', new Vector3(6, 2, 0), new Color3(0.8, 0.2, 0.8), 1);

        // API replicas
        this.storyboard.createService('api-replica1', new Vector3(-3, 0, 0), new Color3(0.3, 0.8, 0.3), 0.8);
        this.storyboard.createService('api-replica2', new Vector3(-3, -1, 0), new Color3(0.3, 0.8, 0.3), 0.8);
        this.storyboard.createService('api-replica3', new Vector3(-3, -2, 0), new Color3(0.3, 0.8, 0.3), 0.8);

        // Arrows
        this.storyboard.createArrow('frontend', 'apiGateway', new Color3(0.29, 0.56, 0.89));
        this.storyboard.createArrow('apiGateway', 'backend', new Color3(0.29, 0.56, 0.89));
        this.storyboard.createArrow('backend', 'database', new Color3(0.3, 0.8, 0.3));
        this.storyboard.createArrow('apiGateway', 'auth', new Color3(1, 0.76, 0.03));
    }

    private static setupStoryboard(): void {
        if (!this.storyboard) return;

        // Step 1: Show monolith
        this.storyboard.addStep('monolith', 
            'A monolithic application runs as a single unit. When traffic increases, the entire application slows down.',
            () => {
                this.storyboard!.showService('monolith', true);
            },
            'Monoliths are easier to develop initially but harder to scale. All components must scale together.'
        );

        // Step 2: Split into microservices
        this.storyboard.addStep('split',
            'The monolith is decomposed into microservices: Frontend, API Gateway, Backend, Auth, and Database.',
            () => {
                this.storyboard!.hideService('monolith');
                this.storyboard!.showService('frontend');
                this.storyboard!.showService('apiGateway');
                this.storyboard!.showService('backend');
                this.storyboard!.showService('auth');
                this.storyboard!.showService('database');
            },
            'Each microservice can be developed, deployed, and scaled independently.'
        );

        // Step 3: Service discovery
        this.storyboard.addStep('discovery',
            'Service discovery enables microservices to find and communicate with each other.',
            () => {
                this.storyboard!.showArrow('frontend', 'apiGateway');
                this.storyboard!.showArrow('apiGateway', 'backend');
                this.storyboard!.showArrow('backend', 'database');
                this.storyboard!.showArrow('apiGateway', 'auth');
            },
            'Kubernetes Services provide DNS-based service discovery automatically.'
        );

        // Step 4: Independent scaling
        this.storyboard.addStep('scaling',
            'The API Gateway scales to 3 replicas to handle increased load. Other services remain unchanged.',
            () => {
                this.storyboard!.showService('api-replica1');
                this.storyboard!.showService('api-replica2');
                this.storyboard!.showService('api-replica3');
                this.storyboard!.scaleService('apiGateway', 1.2);
            },
            'This is the power of microservices - scale only what you need, when you need it.'
        );

        // Step 5: Failover
        this.storyboard.addStep('failover',
            'If one API replica fails, traffic automatically routes to the remaining healthy replicas.',
            () => {
                this.storyboard!.hideService('api-replica2');
                this.storyboard!.createRequestToken('frontend', 'api-replica1', new Color3(0.29, 0.56, 0.89));
                this.storyboard!.createRequestToken('frontend', 'api-replica3', new Color3(0.29, 0.56, 0.89));
            },
            'Kubernetes provides automatic failover and load balancing across service replicas.'
        );
    }

    private static createUI(scene: Scene): void {
        const existingUI = document.getElementById('microservices-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const container = document.createElement('div');
        container.id = 'microservices-ui';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            z-index: 1000;
            pointer-events: none;
        `;

        container.innerHTML = `
            <div style="
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                max-width: 600px;
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #9c27b0;
                border-radius: 12px;
                padding: 20px;
                pointer-events: auto;
                max-height: 60vh;
                overflow-y: auto;
            ">
                <h1 style="color: #9c27b0; font-size: 28px; margin: 0 0 20px 0;">Microservices Architecture</h1>
                <div style="color: #ddd; line-height: 1.8; font-size: 16px;">
                    <p style="margin-bottom: 15px;">
                        Kubernetes is perfect for microservices architectures. Each service can be independently deployed, 
                        scaled, and managed.
                    </p>
                    <p style="color: #9c27b0; margin-top: 20px;">
                        <strong>💡 Tip:</strong> Use the storyboard controls below to see how microservices work!
                    </p>
                </div>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button id="btn-back-microservices" style="
                        background: rgba(100, 100, 100, 0.5);
                        color: #ddd;
                        border: 1px solid #666;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">← Back</button>
                    <button id="btn-next-microservices" style="
                        background: #9c27b0;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Next →</button>
                </div>
            </div>

            <div id="microservices-narration" style="
                position: absolute;
                top: 20px;
                right: 20px;
                max-width: 400px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #9c27b0;
                border-radius: 12px;
                padding: 20px;
                pointer-events: auto;
                display: none;
            ">
                <h3 style="color: #9c27b0; margin: 0 0 10px 0;">Story Narration</h3>
                <p id="narration-text" style="color: #ddd; line-height: 1.6; margin: 0 0 10px 0;"></p>
                <button id="btn-explain-more-micro" style="
                    background: rgba(156, 39, 176, 0.2);
                    color: #9c27b0;
                    border: 1px solid #9c27b0;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                ">Explain More</button>
                <div id="explanation-text-micro" style="
                    margin-top: 10px;
                    padding: 10px;
                    background: rgba(156, 39, 176, 0.1);
                    border-radius: 5px;
                    color: #aaa;
                    font-size: 13px;
                    display: none;
                "></div>
            </div>

            <div id="storyboard-controller-container"></div>
        `;

        document.body.appendChild(container);

        // Setup narration callback
        if (this.storyboard) {
            this.storyboard.setNarrationCallback((text, explanation) => {
                const narrationEl = document.getElementById('microservices-narration');
                const textEl = document.getElementById('narration-text');
                const explanationEl = document.getElementById('explanation-text-micro');
                
                if (narrationEl && textEl) {
                    narrationEl.style.display = 'block';
                    textEl.textContent = text;
                    
                    if (explanationEl && explanation) {
                        explanationEl.textContent = explanation;
                        explanationEl.style.display = 'none';
                        
                        const explainBtn = document.getElementById('btn-explain-more-micro');
                        if (explainBtn) {
                            const newBtn = explainBtn.cloneNode(true) as HTMLElement;
                            explainBtn.parentNode?.replaceChild(newBtn, explainBtn);
                            newBtn.addEventListener('click', () => {
                                explanationEl.style.display = explanationEl.style.display === 'none' ? 'block' : 'none';
                            });
                        }
                    }
                }
            });
        }

        // Setup storyboard controls
        setTimeout(() => {
            try {
                this.controls = new StoryboardControls('storyboard-controller-container');
                this.controls.setOnPlay(() => {
                    if (this.storyboard) {
                        this.storyboard.play();
                        this.controls?.setPlaying(true);
                    }
                });
                this.controls.setOnPause(() => {
                    if (this.storyboard) {
                        this.storyboard.pause();
                        this.controls?.setPlaying(false);
                    }
                });
                this.controls.setOnNext(() => {
                    if (this.storyboard) {
                        this.storyboard.nextStep();
                        this.controls?.updateProgress(this.storyboard.getCurrentStep() + 1, this.storyboard.getTotalSteps());
                    }
                });
                this.controls.setOnPrevious(() => {
                    if (this.storyboard) {
                        this.storyboard.previousStep();
                        this.controls?.updateProgress(this.storyboard.getCurrentStep() + 1, this.storyboard.getTotalSteps());
                    }
                });
                this.controls.setOnRestart(() => {
                    if (this.storyboard) {
                        this.storyboard.restart();
                        this.controls?.updateProgress(1, this.storyboard.getTotalSteps());
                    }
                });
                
                // Update progress on step change
                if (this.storyboard) {
                    this.controls.updateProgress(this.storyboard.getCurrentStep() + 1, this.storyboard.getTotalSteps());
                }
            } catch (err) {
                console.error('[MicroservicesAnimationScene] Failed to create controls:', err);
            }
        }, 100);

        // Setup navigation buttons
        const backBtn = document.getElementById('btn-back-microservices');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: 'main-menu' } 
                }));
            });
        }

        const nextBtn = document.getElementById('btn-next-microservices');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.learningJourneyManager.completeModule('microservices');
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: 'fundamentals' } 
                }));
            });
        }

        (scene as any).ui = container;
    }
}
