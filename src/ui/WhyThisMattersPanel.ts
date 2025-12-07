/**
 * Panel that displays "Why This Matters" information for missions
 */
export class WhyThisMattersPanel {
    private container: HTMLElement | null = null;
    private isVisible: boolean = false;

    constructor() {
        this.createContainer();
    }

    private createContainer(): void {
        // Remove existing panel if it exists
        const existing = document.getElementById('why-this-matters-panel');
        if (existing) {
            existing.remove();
        }

        this.container = document.createElement('div');
        this.container.id = 'why-this-matters-panel';
        this.container.style.cssText = `
            position: fixed;
            right: -400px;
            top: 50%;
            transform: translateY(-50%);
            width: 380px;
            max-height: 70vh;
            background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
            border: 2px solid #4a90e2;
            border-radius: 12px;
            padding: 25px;
            z-index: 350;
            pointer-events: auto;
            box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
            transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
        `;
        document.body.appendChild(this.container);
    }

    show(content: string): void {
        if (!this.container) {
            this.createContainer();
        }

        if (!this.container) return;

        this.container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="color: #4a90e2; margin: 0; font-size: 20px;">💡 Why This Matters</h3>
                <button id="why-matters-close" style="
                    background: transparent;
                    border: none;
                    color: #4a90e2;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 25px;
                    height: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
            <div style="color: #ddd; line-height: 1.7; font-size: 14px;">
                ${content}
            </div>
        `;

        // Setup close handler
        const closeBtn = this.container.querySelector('#why-matters-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // Animate in
        setTimeout(() => {
            if (this.container) {
                this.container.style.right = '20px';
                this.isVisible = true;
            }
        }, 10);
    }

    hide(): void {
        if (this.container) {
            this.container.style.right = '-400px';
            this.isVisible = false;
        }
    }

    toggle(content: string): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(content);
        }
    }

    dispose(): void {
        if (this.container) {
            this.container.remove();
        }
    }
}

