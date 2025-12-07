import { GameSystem } from './gamification/GameSystem.js';
import { AchievementSystem } from './gamification/AchievementSystem.js';
import { CertificationManager } from './certification/CertificationManager.js';
import { MainMenu } from './ui/MainMenu.js';
import { ModuleMenu } from './ui/ModuleMenu.js';
import { GameEngine } from './game/GameEngine.js';
import { SceneManager } from './game/SceneManager.js';
import { CommandTerminal } from './ui/CommandTerminal.js';

/**
 * Main application entry point
 */
class KubernetesGame {
    constructor() {
        this.gameSystem = new GameSystem();
        this.achievementSystem = new AchievementSystem(this.gameSystem);
        this.certificationManager = new CertificationManager(this.gameSystem);
        this.mainMenu = null;
        this.moduleMenu = null;
        this.gameEngine = null;
        this.sceneManager = null;
        this.terminal = null;
        this.currentScreen = 'main-menu';
        
        this.init();
    }

    async init() {
        // Initialize game engine (but don't start rendering until game screen)
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            this.gameEngine = new GameEngine(canvas);
            this.sceneManager = new SceneManager(this.gameEngine);
            
            // Initialize terminal
            this.terminal = new CommandTerminal(this.sceneManager, this.gameSystem);
            
            // Setup game engine update loop
            this.gameEngine.setUpdateCallback((delta) => {
                if (this.terminal && this.terminal.getKubernetesManager()) {
                    this.terminal.getKubernetesManager().update(delta);
                }
            });
        }

        // Initialize main menu
        this.mainMenu = new MainMenu(
            this.gameSystem,
            this.certificationManager,
            this.achievementSystem
        );

        // Initialize module menu
        this.moduleMenu = new ModuleMenu(
            this.certificationManager,
            this.gameSystem
        );

        // Initialize challenge UI
        if (this.terminal) {
            const { ChallengeUI } = await import('./ui/ChallengeUI.js');
            this.challengeUI = new ChallengeUI(
                this.gameSystem,
                this.certificationManager,
                this.terminal.getKubernetesManager(),
                this.achievementSystem
            );
            
            // Connect terminal to challenge validation
            this.setupTerminalChallengeIntegration();
        }

        // Setup screen navigation
        this.setupScreenNavigation();
        
        // Setup pause button after game engine is initialized
        if (this.gameEngine) {
            this.setupPauseButton();
        }
        
        // Setup global event listeners
        this.setupGlobalListeners();
        
        // Show main menu
        this.showScreen('main-menu');
    }

    async setupTerminalChallengeIntegration() {
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput && this.challengeUI) {
            terminalInput.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter' && this.challengeUI) {
                    const command = terminalInput.value.trim();
                    if (command) {
                        // Check if challenge is completed
                        setTimeout(() => {
                            this.challengeUI.checkChallengeCompletion(command);
                        }, 100);
                    }
                }
            });
        }
    }

    setupScreenNavigation() {
        // Listen for screen change events
        document.addEventListener('show-screen', (e) => {
            this.showScreen(e.detail.screen);
        });

        // Back button handlers
        document.getElementById('btn-back-from-profile')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });

        // Terminal toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === '`' || e.key === '~') {
                const terminal = document.getElementById('terminal-panel');
                if (terminal) {
                    terminal.classList.toggle('hidden');
                }
            }
        });

        // Close terminal
        document.getElementById('btn-close-terminal')?.addEventListener('click', () => {
            document.getElementById('terminal-panel').classList.add('hidden');
        });

        // Pause button - setup after game engine is initialized
        this.setupPauseButton();
    }

    setupPauseButton() {
        const pauseButton = document.getElementById('btn-pause');
        if (pauseButton) {
            pauseButton.addEventListener('click', () => {
                if (this.gameEngine) {
                    const isPaused = this.gameEngine.togglePause();
                    // Update button icon
                    pauseButton.textContent = isPaused ? '▶' : '⏸';
                    pauseButton.title = isPaused ? 'Resume (Game Paused)' : 'Pause Game';
                    
                    // Show pause overlay
                    if (isPaused) {
                        this.showPauseOverlay();
                    } else {
                        this.hidePauseOverlay();
                    }
                }
            });
        }
    }

    showPauseOverlay() {
        let overlay = document.getElementById('pause-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'pause-overlay';
            overlay.className = 'pause-overlay';
            overlay.innerHTML = `
                <div class="pause-menu">
                    <h2>⏸ Game Paused</h2>
                    <div class="pause-menu-buttons">
                        <button id="btn-resume-game" class="pause-menu-btn resume-btn">▶ Resume</button>
                        <button id="btn-pause-main-menu" class="pause-menu-btn main-menu-btn">🏠 Main Menu</button>
                    </div>
                </div>
            `;
            document.getElementById('game-screen').appendChild(overlay);
            
            // Setup button handlers
            document.getElementById('btn-resume-game')?.addEventListener('click', () => {
                if (this.gameEngine) {
                    this.gameEngine.togglePause();
                    const pauseButton = document.getElementById('btn-pause');
                    if (pauseButton) {
                        pauseButton.textContent = '⏸';
                        pauseButton.title = 'Pause Game';
                    }
                    this.hidePauseOverlay();
                }
            });
            
            document.getElementById('btn-pause-main-menu')?.addEventListener('click', () => {
                if (this.gameEngine) {
                    this.gameEngine.resume();
                    const pauseButton = document.getElementById('btn-pause');
                    if (pauseButton) {
                        pauseButton.textContent = '⏸';
                        pauseButton.title = 'Pause Game';
                    }
                }
                this.hidePauseOverlay();
                this.showScreen('main-menu');
            });
        }
        overlay.classList.remove('hidden');
    }

    hidePauseOverlay() {
        const overlay = document.getElementById('pause-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    setupGlobalListeners() {
        // Listen for certification selection
        // Note: Module menu handles certification-selected event
        document.addEventListener('certification-selected', (e) => {
            const { certificationId } = e.detail;
            // ModuleMenu will handle showing the module menu
        });

        // Update streak on page load
        this.gameSystem.updateStreak();
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show selected screen
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenId;

            // Start/stop game engine based on screen
            if (screenId === 'game-screen' && this.gameEngine) {
                this.gameEngine.start();
            } else if (this.gameEngine) {
                // Don't render when not on game screen
                // this.gameEngine.stop();
            }
        }
    }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.game = new KubernetesGame();
    });
} else {
    window.game = new KubernetesGame();
}

// Export for debugging
export default KubernetesGame;

