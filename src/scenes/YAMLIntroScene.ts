import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
import { LearningJourneyManager } from '../gameplay/LearningJourneyManager.js';
import { YAMLEditor } from '../ui/YAMLEditor.js';
import { YAMLExerciseRunner } from '../ui/YAMLExerciseRunner.js';
import { YAMLExercises } from '../gameplay/YAMLExercises.js';
import { CompletionAnimation } from '../ui/CompletionAnimation.js';

/**
 * YAML Introduction scene with full exercise system
 */
export class YAMLIntroScene {
    private static learningJourneyManager: LearningJourneyManager;
    private static yamlEditor: YAMLEditor | null = null;
    private static exerciseRunner: YAMLExerciseRunner;
    private static currentLevel: 1 | 2 | 3 = 1;
    private static completedExercises: Set<string> = new Set();
    private static completionAnimation: CompletionAnimation;

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
        this.exerciseRunner = new YAMLExerciseRunner();
        this.completionAnimation = new CompletionAnimation();
        
        // Load completed exercises from localStorage
        this.loadCompletedExercises();
        
        this.createYAMLUI(scene);

        return scene;
    }

    private static loadCompletedExercises(): void {
        try {
            const stored = localStorage.getItem('yamlExercisesCompleted');
            if (stored) {
                this.completedExercises = new Set(JSON.parse(stored));
            }
        } catch (err) {
            console.warn('[YAMLIntroScene] Failed to load completed exercises:', err);
        }
    }

    private static saveCompletedExercises(): void {
        try {
            localStorage.setItem('yamlExercisesCompleted', JSON.stringify(Array.from(this.completedExercises)));
        } catch (err) {
            console.error('[YAMLIntroScene] Failed to save completed exercises:', err);
        }
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

        // Create level selector and exercise view
        this.renderMainView(container);

        document.body.appendChild(container);

        // Setup exercise runner callbacks
        this.exerciseRunner.setOnSuccess((exercise, xpEarned) => {
            this.handleExerciseSuccess(exercise, xpEarned, container);
        });

        this.exerciseRunner.setOnError((errors) => {
            this.showValidationErrors(errors);
        });

        (scene as any).ui = container;
    }

    private static renderMainView(_container: HTMLElement): void {
        const container = document.getElementById('yaml-intro-ui');
        if (!container) return;
        const exercises = YAMLExercises.getExercisesByLevel(this.currentLevel);
        const levelNames = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' };

        container.innerHTML = `
            <div style="
                max-width: 1400px;
                width: 100%;
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #4a90e2;
                border-radius: 12px;
                padding: 40px;
                backdrop-filter: blur(10px);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h1 style="color: #4a90e2; font-size: 36px; margin: 0;">YAML Fundamentals</h1>
                    <button id="btn-back-yaml" style="
                        background: rgba(100, 100, 100, 0.5);
                        color: #ddd;
                        border: 1px solid #666;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">← Back</button>
                </div>

                <div style="display: grid; grid-template-columns: 300px 1fr; gap: 20px; min-height: 600px;">
                    <!-- Left Sidebar: Level & Exercise List -->
                    <div style="
                        background: rgba(0, 0, 0, 0.5);
                        border: 1px solid #4a90e2;
                        border-radius: 8px;
                        padding: 20px;
                    ">
                        <h3 style="color: #4a90e2; margin: 0 0 20px 0;">Levels</h3>
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px;">
                            ${[1, 2, 3].map(level => `
                                <button class="level-btn" data-level="${level}" style="
                                    background: ${this.currentLevel === level ? '#4a90e2' : 'rgba(74, 144, 226, 0.2)'};
                                    color: ${this.currentLevel === level ? 'white' : '#4a90e2'};
                                    border: 1px solid #4a90e2;
                                    padding: 10px;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    text-align: left;
                                ">${levelNames[level as keyof typeof levelNames]}</button>
                            `).join('')}
                        </div>

                        <h3 style="color: #4a90e2; margin: 20px 0 10px 0;">Exercises</h3>
                        <div id="exercise-list" style="display: flex; flex-direction: column; gap: 8px;">
                            ${exercises.map((ex, idx) => {
                                const isCompleted = this.completedExercises.has(ex.id);
                                return `
                                    <div class="exercise-item" data-exercise-id="${ex.id}" style="
                                        padding: 12px;
                                        background: ${isCompleted ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 0, 0, 0.3)'};
                                        border: 1px solid ${isCompleted ? '#4caf50' : '#4a90e2'};
                                        border-radius: 5px;
                                        cursor: pointer;
                                        transition: all 0.3s;
                                    ">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            ${isCompleted ? '<span style="color: #4caf50;">✔</span>' : `<span style="color: #888;">${idx + 1}</span>`}
                                            <span style="color: ${isCompleted ? '#4caf50' : '#ddd'}; font-size: 14px;">${ex.title}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Right Panel: Exercise Content -->
                    <div id="exercise-panel" style="
                        background: rgba(0, 0, 0, 0.5);
                        border: 1px solid #4a90e2;
                        border-radius: 8px;
                        padding: 20px;
                    ">
                        <div style="text-align: center; color: #aaa; padding: 40px;">
                            <p>Select an exercise from the list to begin</p>
                        </div>
                    </div>
                </div>

                <div style="display: flex; justify-content: center; margin-top: 30px;">
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
                    ">Continue to Core Concepts →</button>
                </div>
            </div>
        `;

        // Setup level buttons
        container.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = parseInt((e.target as HTMLElement).getAttribute('data-level') || '1');
                this.currentLevel = level as 1 | 2 | 3;
                this.renderMainView(container);
            });
        });

        // Setup exercise items
        container.querySelectorAll('.exercise-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const exerciseId = (e.target as HTMLElement).closest('.exercise-item')?.getAttribute('data-exercise-id');
                if (exerciseId) {
                    this.loadExercise(exerciseId);
                }
            });
        });

        // Setup back button
        const backBtn = document.getElementById('btn-back-yaml');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: 'main-menu' } 
                }));
            });
        }

        // Setup next button
        const nextBtn = document.getElementById('btn-next-yaml');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.learningJourneyManager.completeModule('yaml');
                container.style.display = 'none';
                document.dispatchEvent(new CustomEvent('scene-change', { 
                    detail: { scene: 'core-concepts' } 
                }));
            });
        }
    }

    private static loadExercise(exerciseId: string): void {
        const exercise = this.exerciseRunner.loadExercise(exerciseId);
        if (!exercise) {
            console.error('[YAMLIntroScene] Exercise not found:', exerciseId);
            return;
        }

        const panel = document.getElementById('exercise-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 20px; height: 100%;">
                <div>
                    <h2 style="color: #4a90e2; margin: 0 0 10px 0;">${exercise.title}</h2>
                    <p style="color: #ddd; line-height: 1.6; margin: 0;">${exercise.prompt}</p>
                </div>

                <div id="yaml-exercise-editor-container"></div>

                <div id="exercise-console" style="
                    min-height: 100px;
                    max-height: 200px;
                    overflow-y: auto;
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid #3e3e3e;
                    border-radius: 5px;
                    padding: 15px;
                    font-family: 'Courier New', monospace;
                    font-size: 13px;
                    color: #00ff00;
                "></div>

                <div style="display: flex; gap: 10px; align-items: center;">
                    <button id="btn-validate" style="
                        background: #4caf50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Run / Validate</button>
                    <button id="btn-reset" style="
                        background: rgba(255, 193, 7, 0.3);
                        color: #ffc107;
                        border: 1px solid #ffc107;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Reset</button>
                    <button id="btn-hint" style="
                        background: rgba(156, 39, 176, 0.3);
                        color: #9c27b0;
                        border: 1px solid #9c27b0;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">💡 Hint (${this.exerciseRunner.getRemainingHints()} remaining)</button>
                </div>

                <div id="exercise-explanation" style="
                    display: none;
                    padding: 15px;
                    background: rgba(76, 175, 80, 0.1);
                    border: 1px solid #4caf50;
                    border-radius: 5px;
                    color: #4caf50;
                "></div>
            </div>
        `;

        // Create editor
        setTimeout(() => {
            try {
                this.yamlEditor = new YAMLEditor('yaml-exercise-editor-container');
                this.yamlEditor.setValue(exercise.starter);
            } catch (err) {
                console.error('[YAMLIntroScene] Failed to create editor:', err);
            }
        }, 100);

        // Setup buttons
        const validateBtn = document.getElementById('btn-validate');
        if (validateBtn) {
            validateBtn.addEventListener('click', () => {
                if (this.yamlEditor) {
                    const result = this.exerciseRunner.validateYAML(this.yamlEditor.getValue());
                    this.updateConsole(result, panel);
                }
            });
        }

        const resetBtn = document.getElementById('btn-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (this.yamlEditor && exercise) {
                    this.yamlEditor.setValue(exercise.starter);
                    this.exerciseRunner.reset();
                    this.exerciseRunner.loadExercise(exerciseId);
                    const consoleEl = document.getElementById('exercise-console');
                    if (consoleEl) consoleEl.innerHTML = '';
                }
            });
        }

        const hintBtn = document.getElementById('btn-hint');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                const hint = this.exerciseRunner.getNextHint();
                if (hint) {
                    const consoleEl = document.getElementById('exercise-console');
                    if (consoleEl) {
                        consoleEl.innerHTML += `<div style="color: #ffc107; margin-top: 10px;"><strong>Hint ${this.exerciseRunner.getHintsUsed()}:</strong> ${hint}</div>`;
                    }
                    hintBtn.textContent = `💡 Hint (${this.exerciseRunner.getRemainingHints()} remaining)`;
                    if (this.exerciseRunner.getRemainingHints() === 0) {
                        (hintBtn as HTMLButtonElement).disabled = true;
                    }
                }
            });
        }
    }

    private static updateConsole(result: { valid: boolean; errors: string[] }, _panel: HTMLElement): void {
        const consoleEl = document.getElementById('exercise-console');
        if (!consoleEl) return;

        if (result.valid) {
            consoleEl.innerHTML = `<div style="color: #4caf50;">✓ Validation passed!</div>`;
        } else {
            consoleEl.innerHTML = `<div style="color: #f44336;">✗ Validation failed:</div>
                <ul style="margin: 10px 0 0 20px; padding: 0;">
                    ${result.errors.map(e => `<li style="color: #f44336;">${e}</li>`).join('')}
                </ul>`;
        }
    }

    private static handleExerciseSuccess(exercise: any, xpEarned: number, _container: HTMLElement): void {
        // Mark as completed
        this.completedExercises.add(exercise.id);
        this.saveCompletedExercises();

        // Show success animation
        this.completionAnimation.show(`Exercise Complete!`, xpEarned);

        // Show explanation
        const explanationEl = document.getElementById('exercise-explanation');
        if (explanationEl && exercise.explanation) {
            explanationEl.style.display = 'block';
            explanationEl.innerHTML = `<strong>✓ Correct!</strong><br>${exercise.explanation}<br><br><strong>XP Earned: ${xpEarned}</strong>`;
        }

        // Update exercise list - need to get container from DOM
        const mainContainer = document.getElementById('yaml-intro-ui');
        if (mainContainer) {
            this.renderMainView(mainContainer);
        }
    }

    private static showValidationErrors(errors: string[]): void {
        const consoleEl = document.getElementById('exercise-console');
        if (consoleEl) {
            consoleEl.innerHTML = `<div style="color: #f44336;">✗ Validation failed:</div>
                <ul style="margin: 10px 0 0 20px; padding: 0;">
                    ${errors.map(e => `<li style="color: #f44336;">${e}</li>`).join('')}
                </ul>`;
        }
    }
}
