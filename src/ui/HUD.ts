/**
 * Heads-up display for game information
 */
export class HUD {
    private container: HTMLElement | null = null;

    constructor() {
        this.createHUD();
    }

    private createHUD(): void {
        this.container = document.createElement('div');
        this.container.id = 'game-hud';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 50;
        `;
        document.body.appendChild(this.container);
    }

    showObjective(objective: string): void {
        if (!this.container) return;

        // Remove existing objective if it exists
        this.hideObjective();

        const objectiveEl = document.createElement('div');
        objectiveEl.id = 'objective-display';
        objectiveEl.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 15px 25px;
            border-radius: 8px;
            border: 2px solid #4a90e2;
            color: #fff;
            pointer-events: auto;
            max-width: 600px;
            text-align: center;
        `;
        objectiveEl.textContent = objective;
        this.container.appendChild(objectiveEl);
    }

    hideObjective(): void {
        const objectiveEl = document.getElementById('objective-display');
        if (objectiveEl) {
            objectiveEl.remove();
        }
    }

    dispose(): void {
        if (this.container) {
            this.container.remove();
        }
    }
}

