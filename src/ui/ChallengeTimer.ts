/**
 * Challenge timer UI component
 */
export class ChallengeTimer {
    private container: HTMLElement | null = null;
    private timeRemaining: number = 0;
    private intervalId: number | null = null;
    private onTimeUpCallback?: () => void;

    constructor() {
        this.createContainer();
    }

    private createContainer(): void {
        // Remove existing timer if it exists
        const existing = document.getElementById('challenge-timer');
        if (existing) {
            existing.remove();
        }

        this.container = document.createElement('div');
        this.container.id = 'challenge-timer';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 3px solid #4a90e2;
            border-radius: 12px;
            padding: 20px;
            z-index: 300;
            pointer-events: none;
            min-width: 200px;
            text-align: center;
            box-shadow: 0 0 20px rgba(74, 144, 226, 0.5);
        `;
        document.body.appendChild(this.container);
    }

    start(totalSeconds: number, onTimeUp?: () => void): void {
        if (!this.container) {
            this.createContainer();
        }

        this.timeRemaining = totalSeconds;
        this.onTimeUpCallback = onTimeUp;

        this.updateDisplay();

        // Start countdown
        this.intervalId = window.setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();

            // Play tick sound in last 5 seconds
            if (this.timeRemaining <= 5 && this.timeRemaining > 0) {
                this.playTickSound();
            }

            if (this.timeRemaining <= 0) {
                this.stop();
                if (this.onTimeUpCallback) {
                    this.onTimeUpCallback();
                }
            }
        }, 1000);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    getTimeRemaining(): number {
        return this.timeRemaining;
    }

    private updateDisplay(): void {
        if (!this.container) return;

        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Determine color based on time remaining
        let color = '#4a90e2'; // Blue (full time)
        let borderColor = '#4a90e2';
        let pulse = '';

        if (this.timeRemaining <= 10) {
            color = '#ff4444'; // Red (last 10 seconds)
            borderColor = '#ff4444';
            pulse = 'pulse 1s infinite';
        } else if (this.timeRemaining <= this.timeRemaining * 0.5) {
            color = '#ffc107'; // Yellow (mid-time)
            borderColor = '#ffc107';
        }

        this.container.style.borderColor = borderColor;
        this.container.style.animation = pulse;

        this.container.innerHTML = `
            <div style="color: #aaa; font-size: 14px; margin-bottom: 5px;">Time Remaining</div>
            <div style="color: ${color}; font-size: 48px; font-weight: bold; font-family: 'Courier New', monospace; text-shadow: 0 0 10px ${color};">
                ${timeString}
            </div>
        `;

        // Add pulse animation style
        if (this.timeRemaining <= 10) {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 20px ${borderColor}; }
                    50% { transform: scale(1.05); box-shadow: 0 0 30px ${borderColor}; }
                }
            `;
            if (!document.head.querySelector('#timer-pulse-animation')) {
                style.id = 'timer-pulse-animation';
                document.head.appendChild(style);
            }
        }
    }

    private playTickSound(): void {
        try {
            const audio = new Audio('./assets/sounds/countdown_tick.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {});
        } catch (error) {
            // Sound file might not exist
        }
    }

    hide(): void {
        this.stop();
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    show(): void {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }

    dispose(): void {
        this.stop();
        if (this.container) {
            this.container.remove();
        }
    }
}

