/**
 * Animation that plays when a mission is completed
 */
export class CompletionAnimation {
    private container: HTMLElement | null = null;

    show(missionTitle: string, xpEarned: number): void {
        // Remove existing animation if it exists
        const existing = document.getElementById('completion-animation');
        if (existing) {
            existing.remove();
        }

        this.container = document.createElement('div');
        this.container.id = 'completion-animation';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 500;
            pointer-events: none;
        `;

        this.container.innerHTML = `
            <div style="
                text-align: center;
                animation: completionFadeIn 0.5s ease-out;
            ">
                <div style="
                    font-size: 72px;
                    margin-bottom: 20px;
                    animation: bounce 0.6s ease-out;
                ">🎉</div>
                <h1 style="
                    color: #4a90e2;
                    font-size: 48px;
                    margin: 0 0 10px 0;
                    text-shadow: 0 0 20px rgba(74, 144, 226, 0.5);
                    animation: slideDown 0.5s ease-out;
                ">Mission Completed!</h1>
                <p style="
                    color: #fff;
                    font-size: 24px;
                    margin: 10px 0;
                    animation: slideUp 0.5s ease-out 0.2s both;
                ">${missionTitle}</p>
                <div style="
                    color: #ffc107;
                    font-size: 20px;
                    margin-top: 15px;
                    animation: slideUp 0.5s ease-out 0.4s both;
                ">
                    +${xpEarned} XP Earned
                </div>
            </div>
        `;

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes completionFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-30px); }
            }
            @keyframes slideDown {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        if (!document.head.querySelector('#completion-animations')) {
            style.id = 'completion-animations';
            document.head.appendChild(style);
        }

        document.body.appendChild(this.container);

        // Create particle burst effect (glow around edges)
        this.createParticleBurst();

        // Auto-hide after 2.5 seconds
        setTimeout(() => {
            this.hide();
        }, 2500);
    }

    private createParticleBurst(): void {
        // Create glowing particles around screen edges
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #4a90e2;
                border-radius: 50%;
                box-shadow: 0 0 10px #4a90e2;
                pointer-events: none;
                z-index: 501;
            `;

            // Random position around screen edges
            const side = Math.floor(Math.random() * 4);
            let left = 0, top = 0;
            switch (side) {
                case 0: // Top
                    left = Math.random() * window.innerWidth;
                    top = -10;
                    break;
                case 1: // Right
                    left = window.innerWidth + 10;
                    top = Math.random() * window.innerHeight;
                    break;
                case 2: // Bottom
                    left = Math.random() * window.innerWidth;
                    top = window.innerHeight + 10;
                    break;
                case 3: // Left
                    left = -10;
                    top = Math.random() * window.innerHeight;
                    break;
            }

            particle.style.left = `${left}px`;
            particle.style.top = `${top}px`;

            document.body.appendChild(particle);

            // Animate particle
            const targetX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
            const targetY = window.innerHeight / 2 + (Math.random() - 0.5) * 200;

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${targetX - left}px, ${targetY - top}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    hide(): void {
        if (this.container) {
            this.container.style.animation = 'completionFadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (this.container) {
                    this.container.remove();
                }
            }, 300);
        }
    }

    dispose(): void {
        if (this.container) {
            this.container.remove();
        }
    }
}

