import { SceneManager } from './SceneManager.js';

/**
 * Manages keyboard and mouse input
 */
export class InputManager {
    private canvas: HTMLCanvasElement;
    private sceneManager: SceneManager;
    private keys: Set<string> = new Set();
    private mousePosition: { x: number; y: number } = { x: 0, y: 0 };

    constructor(canvas: HTMLCanvasElement, sceneManager: SceneManager) {
        this.canvas = canvas;
        this.sceneManager = sceneManager;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            this.keys.add(e.key.toLowerCase());
            this.handleKeyDown(e);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.key.toLowerCase());
        });

        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('click', (e) => {
            this.handleClick(e);
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        // Toggle terminal with backtick
        if (event.key === '`' || event.key === 'Backquote') {
            event.preventDefault();
            const terminal = document.getElementById('terminal');
            if (terminal) {
                // Check if terminal has content (is initialized)
                const hasContent = terminal.querySelector('#terminal-input') !== null;
                
                if (!hasContent) {
                    console.warn('[InputManager] Terminal not initialized for current scene');
                    // Try to initialize terminal if we're in a scene that should have it
                    const currentSceneType = this.sceneManager.getCurrentSceneType();
                    if (currentSceneType === 'fundamentals' || currentSceneType === 'lab') {
                        // Terminal should be initialized by scene, but if not, show message
                        console.warn('[InputManager] Terminal UI not available. Scene may still be loading.');
                        return;
                    }
                }
                
                const isVisible = terminal.style.display !== 'none' && terminal.style.display !== '';
                terminal.style.display = isVisible ? 'none' : 'block';
                // Focus input when showing terminal
                if (!isVisible && hasContent) {
                    const input = terminal.querySelector('#terminal-input') as HTMLInputElement;
                    if (input) {
                        setTimeout(() => input.focus(), 100);
                    }
                }
            }
        }

        // ESC to close dialogs
        if (event.key === 'Escape') {
            const dialog = document.getElementById('dialog-box');
            if (dialog && dialog.style.display !== 'none' && dialog.style.display !== '') {
                dialog.style.display = 'none';
            }
        }
    }

    private handleClick(_event: MouseEvent): void {
        // Forward click to current scene if needed
        const currentScene = this.sceneManager.getCurrentScene();
        if (currentScene) {
            // Scene-specific click handling can be added here
        }
    }

    isKeyPressed(key: string): boolean {
        return this.keys.has(key.toLowerCase());
    }

    getMousePosition(): { x: number; y: number } {
        return { ...this.mousePosition };
    }
}

