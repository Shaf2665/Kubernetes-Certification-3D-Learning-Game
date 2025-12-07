/**
 * Tutorial popup that appears at the start of each mission
 */
export class TutorialPopup {
    private container: HTMLElement | null = null;

    constructor() {
        this.createContainer();
    }

    private createContainer(): void {
        // Remove existing popup if it exists
        const existing = document.getElementById('tutorial-popup');
        if (existing) {
            existing.remove();
        }

        this.container = document.createElement('div');
        this.container.id = 'tutorial-popup';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 400;
            pointer-events: auto;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(this.container);
    }

    show(title: string, explanation: string): void {
        if (!this.container) {
            this.createContainer();
        }

        if (!this.container) return;

        this.container.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
                border: 2px solid #4a90e2;
                border-radius: 12px;
                padding: 30px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                animation: fadeIn 0.3s ease-in;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #4a90e2; margin: 0; font-size: 24px;">📚 ${title}</h2>
                    <button id="tutorial-close" style="
                        background: transparent;
                        border: none;
                        color: #4a90e2;
                        font-size: 24px;
                        cursor: pointer;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
                <div style="color: #ddd; line-height: 1.8; font-size: 15px; margin-bottom: 25px;">
                    ${explanation}
                </div>
                <button id="tutorial-got-it" style="
                    background: #4a90e2;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    width: 100%;
                    transition: all 0.3s;
                " onmouseover="this.style.background='#5aa0f2'" onmouseout="this.style.background='#4a90e2'">Got it!</button>
            </div>
        `;

        // Add fade-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        if (!document.head.querySelector('#tutorial-animations')) {
            style.id = 'tutorial-animations';
            document.head.appendChild(style);
        }

        this.container.style.display = 'flex';

        // Setup close handlers
        const closeBtn = this.container.querySelector('#tutorial-close');
        const gotItBtn = this.container.querySelector('#tutorial-got-it');

        const closeHandler = () => {
            this.hide();
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeHandler);
        }
        if (gotItBtn) {
            gotItBtn.addEventListener('click', closeHandler);
        }

        // Close on ESC key
        const escHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.container && this.container.style.display !== 'none') {
                this.hide();
            }
        };
        window.addEventListener('keydown', escHandler);
    }

    showStoryIntro(title: string, storyText: string): void {
        if (!this.container) {
            this.createContainer();
        }

        if (!this.container) return;

        this.container.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
                border: 2px solid #4a90e2;
                border-radius: 12px;
                padding: 30px;
                max-width: 700px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                animation: fadeIn 0.3s ease-in;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #4a90e2; margin: 0; font-size: 24px;">📖 ${title}</h2>
                    <button id="tutorial-close" style="
                        background: transparent;
                        border: none;
                        color: #4a90e2;
                        font-size: 24px;
                        cursor: pointer;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
                <div id="story-text" style="color: #ddd; line-height: 1.8; font-size: 16px; margin-bottom: 25px; min-height: 100px;">
                    ${storyText}
                </div>
                <button id="tutorial-got-it" style="
                    background: #4a90e2;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    width: 100%;
                    transition: all 0.3s;
                " onmouseover="this.style.background='#5aa0f2'" onmouseout="this.style.background='#4a90e2'">Begin Mission</button>
            </div>
        `;

        // Add fade-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        if (!document.head.querySelector('#tutorial-animations')) {
            style.id = 'tutorial-animations';
            document.head.appendChild(style);
        }

        this.container.style.display = 'flex';

        // Setup close handlers
        const closeBtn = this.container.querySelector('#tutorial-close');
        const gotItBtn = this.container.querySelector('#tutorial-got-it');

        const closeHandler = () => {
            this.hide();
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeHandler);
        }
        if (gotItBtn) {
            gotItBtn.addEventListener('click', closeHandler);
        }

        // Close on ESC key
        const escHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.container && this.container.style.display !== 'none') {
                this.hide();
            }
        };
        window.addEventListener('keydown', escHandler);
    }

    hide(): void {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    dispose(): void {
        if (this.container) {
            this.container.remove();
        }
    }
}

