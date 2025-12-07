/**
 * Manages all UI elements and overlays
 */
export class UIManager {
    private hud: HTMLElement | null = null;
    private terminal: HTMLElement | null = null;
    private dialogBox: HTMLElement | null = null;

    async init(): Promise<void> {
        this.createHUD();
        this.createTerminal();
        this.createDialogBox();
    }

    private createHUD(): void {
        this.hud = document.createElement('div');
        this.hud.id = 'hud';
        this.hud.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        `;
        document.body.appendChild(this.hud);
    }

    private createTerminal(): void {
        this.terminal = document.createElement('div');
        this.terminal.id = 'terminal';
        this.terminal.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 600px;
            height: 300px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #4a90e2;
            border-radius: 8px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #00ff00;
            pointer-events: auto;
            z-index: 200;
            display: none;
        `;
        document.body.appendChild(this.terminal);
    }

    private createDialogBox(): void {
        this.dialogBox = document.createElement('div');
        this.dialogBox.id = 'dialog-box';
        this.dialogBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(20, 20, 30, 0.95);
            border: 2px solid #4a90e2;
            border-radius: 12px;
            padding: 30px;
            min-width: 400px;
            max-width: 600px;
            color: #ffffff;
            pointer-events: auto;
            z-index: 300;
            display: none;
        `;
        document.body.appendChild(this.dialogBox);
    }

    showTerminal(): void {
        if (this.terminal) {
            this.terminal.style.display = 'block';
        }
    }

    hideTerminal(): void {
        if (this.terminal) {
            this.terminal.style.display = 'none';
        }
    }

    showDialog(title: string, message: string, onClose?: () => void): void {
        if (this.dialogBox) {
            this.dialogBox.innerHTML = `
                <h2 style="margin-bottom: 15px; color: #4a90e2;">${title}</h2>
                <p style="margin-bottom: 20px; line-height: 1.6;">${message}</p>
                <button id="dialog-close" style="
                    background: #4a90e2;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                ">Close</button>
            `;
            this.dialogBox.style.display = 'block';

            const closeBtn = this.dialogBox.querySelector('#dialog-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.hideDialog();
                    if (onClose) onClose();
                });
            }
        }
    }

    hideDialog(): void {
        if (this.dialogBox) {
            this.dialogBox.style.display = 'none';
        }
    }

    getHUD(): HTMLElement | null {
        return this.hud;
    }

    getTerminal(): HTMLElement | null {
        return this.terminal;
    }

    dispose(): void {
        if (this.hud) this.hud.remove();
        if (this.terminal) this.terminal.remove();
        if (this.dialogBox) this.dialogBox.remove();
    }
}

