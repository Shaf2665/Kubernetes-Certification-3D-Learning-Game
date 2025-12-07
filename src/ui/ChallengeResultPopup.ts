/**
 * Challenge result popup (success or failure)
 */
export class ChallengeResultPopup {
    private container: HTMLElement | null = null;

    constructor() {
        this.createContainer();
    }

    private createContainer(): void {
        // Remove existing popup if it exists
        const existing = document.getElementById('challenge-result-popup');
        if (existing) {
            existing.remove();
        }

        this.container = document.createElement('div');
        this.container.id = 'challenge-result-popup';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 800;
            pointer-events: auto;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(this.container);
    }

    showSuccess(timeTaken: number, xpEarned: number, onClose?: () => void): void {
        if (!this.container) {
            this.createContainer();
        }

        if (!this.container) return;

        // Play success sound
        this.playSound('./assets/sounds/challenge_success.mp3');

        // Create confetti effect
        this.createConfetti();

        this.container.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
                border: 3px solid #4a90e2;
                border-radius: 12px;
                padding: 40px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                animation: successFadeIn 0.5s ease-out;
            ">
                <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 0.6s ease-out;">🎉</div>
                <h1 style="color: #4a90e2; font-size: 36px; margin: 0 0 20px 0; text-shadow: 0 0 20px rgba(74, 144, 226, 0.5);">
                    Challenge Complete!
                </h1>
                <div style="color: #ddd; font-size: 18px; margin-bottom: 15px;">
                    Time: <strong style="color: #4a90e2;">${timeTaken.toFixed(1)}s</strong>
                </div>
                <div style="color: #ffc107; font-size: 24px; margin-bottom: 30px; font-weight: bold;">
                    +${xpEarned} XP Earned
                </div>
                <button id="result-close" style="
                    background: #4a90e2;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    transition: all 0.3s;
                " onmouseover="this.style.background='#5aa0f2'" onmouseout="this.style.background='#4a90e2'">Continue</button>
            </div>
        `;

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes successFadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
        `;
        if (!document.head.querySelector('#challenge-result-animations')) {
            style.id = 'challenge-result-animations';
            document.head.appendChild(style);
        }

        this.container.style.display = 'flex';

        // Setup close handler
        const closeBtn = this.container.querySelector('#result-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
                if (onClose) {
                    onClose();
                }
            });
        }
    }

    showFailure(onRetry?: () => void, onClose?: () => void): void {
        if (!this.container) {
            this.createContainer();
        }

        if (!this.container) return;

        // Play fail sound
        this.playSound('./assets/sounds/fail.mp3');

        this.container.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(46, 26, 26, 0.95) 0%, rgba(62, 22, 22, 0.95) 100%);
                border: 3px solid #ff4444;
                border-radius: 12px;
                padding: 40px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                animation: failureFadeIn 0.5s ease-out;
            ">
                <div style="font-size: 80px; margin-bottom: 20px;">❌</div>
                <h1 style="color: #ff4444; font-size: 36px; margin: 0 0 20px 0;">
                    Challenge Failed
                </h1>
                <p style="color: #ddd; font-size: 18px; margin-bottom: 30px;">
                    Time's up! Try again?
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="result-retry" style="
                        background: #ff4444;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 500;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='#ff6666'" onmouseout="this.style.background='#ff4444'">Retry</button>
                    <button id="result-close" style="
                        background: #666;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 500;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='#777'" onmouseout="this.style.background='#666'">Close</button>
                </div>
            </div>
        `;

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes failureFadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        if (!document.head.querySelector('#challenge-result-animations')) {
            style.id = 'challenge-result-animations';
            document.head.appendChild(style);
        }

        this.container.style.display = 'flex';

        // Setup handlers
        const retryBtn = this.container.querySelector('#result-retry');
        const closeBtn = this.container.querySelector('#result-close');

        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.hide();
                if (onRetry) {
                    onRetry();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
                if (onClose) {
                    onClose();
                }
            });
        }
    }

    private createConfetti(): void {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${['#4a90e2', '#ffc107', '#4a90e2', '#ff4444', '#4a90e2'][Math.floor(Math.random() * 5)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                z-index: 801;
                pointer-events: none;
                border-radius: 50%;
            `;

            document.body.appendChild(confetti);

            const angle = (Math.random() - 0.5) * 60;
            const velocity = 50 + Math.random() * 50;
            const rotation = Math.random() * 360;

            confetti.animate([
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${Math.sin(angle) * velocity}px, ${window.innerHeight + 100}px) rotate(${rotation}deg)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                confetti.remove();
            };
        }
    }

    private playSound(path: string): void {
        try {
            const audio = new Audio(path);
            audio.volume = 0.5;
            audio.play().catch(() => {});
        } catch (error) {
            // Sound file might not exist
        }
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

