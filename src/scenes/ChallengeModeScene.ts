import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { ClusterSimulator } from '../kubernetes/ClusterSimulator.js';
import { ChallengeMissions } from '../gameplay/ChallengeMissions.js';
import { ChallengeMissionManager } from '../gameplay/ChallengeMissionManager.js';
import { ProgressionSystem } from '../gameplay/ProgressionSystem.js';
import { TutorialPopup } from '../ui/TutorialPopup.js';
import { TerminalUI } from '../ui/TerminalUI.js';

/**
 * Challenge Mode scene with timed challenges
 */
export class ChallengeModeScene {
    private static clusterSimulator: ClusterSimulator | null = null;
    private static challengeManager: ChallengeMissionManager | null = null;
    private static terminalUI: TerminalUI | null = null;
    private static progressionSystem: ProgressionSystem | null = null;

    static async create(engine: Engine): Promise<Scene> {
        console.log('[ChallengeModeScene] Initializing ChallengeModeScene...');
        
        // Reset static variables
        this.clusterSimulator = null;
        this.challengeManager = null;
        this.terminalUI = null;
        this.progressionSystem = new ProgressionSystem();

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

            // Create lights
            const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
            light.intensity = 0.7;
            const dirLight = new DirectionalLight('dirLight', new Vector3(-1, -1, -1), scene);
            dirLight.intensity = 0.5;

            // Create simple environment
            const ground = MeshBuilder.CreateGround('ground', { width: 30, height: 30 }, scene);
            const groundMaterial = new StandardMaterial('groundMat', scene);
            groundMaterial.diffuseColor = new Color3(0.1, 0.1, 0.15);
            ground.material = groundMaterial;

            // Create HUD
            this.createHUD(scene);

            // Show story intro
            const tutorialPopup = new TutorialPopup();
            tutorialPopup.showStoryIntro(
                'Challenge Mode',
                'You\'ve grown strong, Kubernetes Warrior. Now the cluster tests your skills under pressure. Complete timed challenges to prove your mastery!'
            );

            // Initialize cluster simulator
            console.log('[ChallengeModeScene] Initializing ClusterSimulator...');
            this.clusterSimulator = new ClusterSimulator(scene);
            try {
                await this.clusterSimulator.init();
                console.log('[ChallengeModeScene] ClusterSimulator initialized successfully');
            } catch (err) {
                console.error('[ChallengeModeScene] ClusterSimulator init error:', err);
            }

            // Initialize terminal UI
            if (this.clusterSimulator) {
                try {
                    this.terminalUI = new TerminalUI(this.clusterSimulator);
                    await this.terminalUI.init();
                    console.log('[ChallengeModeScene] TerminalUI initialized successfully');
                } catch (err) {
                    console.error('[ChallengeModeScene] TerminalUI init error:', err);
                }
            }

            // Initialize challenge manager
            if (this.clusterSimulator) {
                this.challengeManager = new ChallengeMissionManager(this.clusterSimulator, this.progressionSystem);
            }

            console.log('[ChallengeModeScene] ChallengeModeScene loaded successfully');
        } catch (err) {
            console.error('[ChallengeModeScene] Scene creation error:', err);
        }

        return scene;
    }

    private static createHUD(scene: Scene): void {
        // Remove existing HUD if it exists
        const existingHud = document.getElementById('challenge-mode-hud');
        if (existingHud) {
            existingHud.remove();
        }

        const hud = document.createElement('div');
        hud.id = 'challenge-mode-hud';
        hud.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
            overflow-y: auto;
        `;

        const challenges = ChallengeMissions.getChallenges();
        const challengeManager = this.challengeManager;

        hud.innerHTML = `
            <div style="
                background: rgba(0, 0, 0, 0.9);
                min-height: 100vh;
                padding: 40px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
            ">
                <div style="max-width: 1200px; width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <h1 style="color: #ffc107; font-size: 36px; margin: 0; text-shadow: 0 0 20px rgba(255, 193, 7, 0.5);">
                            ⚡ Challenge Mode
                        </h1>
                        <button id="btn-back-menu" style="
                            background: rgba(74, 144, 226, 0.3);
                            color: #4a90e2;
                            border: 1px solid #4a90e2;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            pointer-events: auto;
                            font-size: 16px;
                            transition: all 0.3s;
                        " onmouseover="this.style.background='rgba(74, 144, 226, 0.5)'" onmouseout="this.style.background='rgba(74, 144, 226, 0.3)'">Back to Menu</button>
                    </div>

                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                        gap: 20px;
                        margin-top: 20px;
                    ">
                        ${challenges.map(challenge => {
                            const bestTime = challengeManager?.getBestTime(challenge.id);
                            const attempts = challengeManager?.getAttempts(challenge.id) || 0;
                            const difficultyColors = {
                                'Easy': '#4a90e2',
                                'Medium': '#ffc107',
                                'Hard': '#ff4444'
                            };
                            
                            return `
                                <div style="
                                    background: rgba(26, 26, 46, 0.95);
                                    border: 2px solid ${difficultyColors[challenge.difficulty]};
                                    border-radius: 12px;
                                    padding: 20px;
                                    pointer-events: auto;
                                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
                                ">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                                        <h3 style="color: ${difficultyColors[challenge.difficulty]}; margin: 0; font-size: 20px;">
                                            ${challenge.title}
                                        </h3>
                                        <span style="
                                            background: ${difficultyColors[challenge.difficulty]};
                                            color: white;
                                            padding: 4px 12px;
                                            border-radius: 12px;
                                            font-size: 12px;
                                            font-weight: bold;
                                        ">${challenge.difficulty}</span>
                                    </div>
                                    <p style="color: #ddd; margin: 0 0 15px 0; line-height: 1.6; font-size: 14px;">
                                        ${challenge.description}
                                    </p>
                                    <div style="margin-bottom: 15px;">
                                        <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Target Time</div>
                                        <div style="color: #4a90e2; font-size: 18px; font-weight: bold;">
                                            ${challenge.targetTime}s
                                        </div>
                                    </div>
                                    <div style="margin-bottom: 15px;">
                                        <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">XP Reward</div>
                                        <div style="color: #ffc107; font-size: 18px; font-weight: bold;">
                                            +${challenge.xpReward} XP
                                        </div>
                                    </div>
                                    ${bestTime ? `
                                        <div style="margin-bottom: 15px; padding: 10px; background: rgba(74, 144, 226, 0.1); border-radius: 6px;">
                                            <div style="color: #aaa; font-size: 12px; margin-bottom: 5px;">Best Time</div>
                                            <div style="color: #4a90e2; font-size: 16px; font-weight: bold;">
                                                ${bestTime.toFixed(1)}s
                                            </div>
                                            <div style="color: #888; font-size: 11px; margin-top: 5px;">
                                                ${attempts} attempt${attempts !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    ` : ''}
                                    <button class="start-challenge-btn" data-challenge-id="${challenge.id}" style="
                                        background: ${difficultyColors[challenge.difficulty]};
                                        color: white;
                                        border: none;
                                        padding: 12px 24px;
                                        border-radius: 6px;
                                        cursor: pointer;
                                        font-size: 16px;
                                        font-weight: 500;
                                        width: 100%;
                                        transition: all 0.3s;
                                    " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Start Challenge</button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(hud);

        // Setup back button
        const backBtn = document.getElementById('btn-back-menu');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                hud.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { detail: { scene: 'main-menu' } }));
            });
        }

        // Setup challenge start buttons
        const startButtons = hud.querySelectorAll('.start-challenge-btn');
        startButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const challengeId = (e.target as HTMLElement).getAttribute('data-challenge-id');
                if (challengeId && this.challengeManager) {
                    const challenge = ChallengeMissions.getChallenge(challengeId);
                    if (challenge) {
                        // Hide challenge selection UI
                        hud.style.display = 'none';
                        
                        // Start the challenge
                        this.challengeManager.startChallenge(challenge, () => {
                            // Challenge completed or failed - show selection again
                            hud.style.display = 'block';
                            // Refresh best times
                            this.createHUD(scene);
                        });
                    }
                }
            });
        });

        (scene as any).hud = hud;
    }
}

