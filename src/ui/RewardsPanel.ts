/**
 * Panel that displays unlocked rewards, badges, and cosmetics
 */
import { ProgressionSystem, Reward } from '../gameplay/ProgressionSystem.js';

export class RewardsPanel {
    private container: HTMLElement | null = null;
    private progressionSystem: ProgressionSystem;
    private isVisible: boolean = false;

    constructor(progressionSystem: ProgressionSystem) {
        this.progressionSystem = progressionSystem;
        this.createContainer();
    }

    private createContainer(): void {
        // Remove existing panel if it exists
        const existing = document.getElementById('rewards-panel');
        if (existing) {
            existing.remove();
        }

        this.container = document.createElement('div');
        this.container.id = 'rewards-panel';
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
            z-index: 600;
            pointer-events: auto;
            backdrop-filter: blur(10px);
            overflow-y: auto;
        `;
        document.body.appendChild(this.container);
    }

    show(): void {
        if (!this.container) {
            this.createContainer();
        }

        if (!this.container) return;

        const unlockedRewards = this.progressionSystem.getUnlockedRewards();
        const allRewards = this.progressionSystem.getAvailableRewards();

        this.container.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
                border: 2px solid #4a90e2;
                border-radius: 12px;
                padding: 30px;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                animation: fadeIn 0.3s ease-in;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <h2 style="color: #4a90e2; margin: 0; font-size: 28px;">🏆 Rewards & Achievements</h2>
                    <button id="rewards-close" style="
                        background: transparent;
                        border: none;
                        color: #4a90e2;
                        font-size: 28px;
                        cursor: pointer;
                        padding: 0;
                        width: 35px;
                        height: 35px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="color: #4a90e2; margin: 0 0 15px 0; font-size: 20px;">Badges</h3>
                    <div id="badges-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                        ${this.renderRewards(allRewards.filter(r => r.type === 'badge'), unlockedRewards)}
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="color: #4a90e2; margin: 0 0 15px 0; font-size: 20px;">Cosmetics</h3>
                    <div id="cosmetics-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                        ${this.renderRewards(allRewards.filter(r => r.type === 'cosmetic'), unlockedRewards)}
                    </div>
                </div>

                <div>
                    <h3 style="color: #4a90e2; margin: 0 0 15px 0; font-size: 20px;">Features</h3>
                    <div id="features-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                        ${this.renderRewards(allRewards.filter(r => r.type === 'feature'), unlockedRewards)}
                    </div>
                </div>
            </div>
        `;

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes cardReveal {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        if (!document.head.querySelector('#rewards-animations')) {
            style.id = 'rewards-animations';
            document.head.appendChild(style);
        }

        // Setup close handler
        const closeBtn = this.container.querySelector('#rewards-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // Animate card reveals
        const cards = this.container.querySelectorAll('.reward-card');
        cards.forEach((card, index) => {
            (card as HTMLElement).style.animation = `cardReveal 0.4s ease-out ${index * 0.1}s both`;
        });

        this.container.style.display = 'flex';
        this.isVisible = true;

        // Close on ESC
        const escHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        };
        window.addEventListener('keydown', escHandler);
    }

    private renderRewards(rewards: Reward[], unlocked: string[]): string {
        return rewards.map(reward => {
            const isUnlocked = unlocked.includes(reward.id);
            return `
                <div class="reward-card" style="
                    background: ${isUnlocked ? 'rgba(74, 144, 226, 0.2)' : 'rgba(50, 50, 50, 0.5)'};
                    border: 2px solid ${isUnlocked ? '#4a90e2' : '#666'};
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                    opacity: ${isUnlocked ? '1' : '0.5'};
                ">
                    <div style="font-size: 40px; margin-bottom: 10px;">
                        ${isUnlocked ? this.getRewardIcon(reward.type) : '🔒'}
                    </div>
                    <h4 style="color: ${isUnlocked ? '#4a90e2' : '#888'}; margin: 0 0 5px 0; font-size: 16px;">
                        ${reward.name}
                    </h4>
                    <p style="color: #aaa; margin: 0; font-size: 12px; line-height: 1.4;">
                        ${reward.description}
                    </p>
                    ${isUnlocked ? '<div style="color: #4a90e2; margin-top: 8px; font-size: 12px;">✓ Unlocked</div>' : ''}
                </div>
            `;
        }).join('');
    }

    private getRewardIcon(type: string): string {
        switch (type) {
            case 'badge': return '🏅';
            case 'cosmetic': return '✨';
            case 'feature': return '🚀';
            default: return '⭐';
        }
    }

    hide(): void {
        if (this.container) {
            this.container.style.display = 'none';
            this.isVisible = false;
        }
    }

    toggle(): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    dispose(): void {
        if (this.container) {
            this.container.remove();
        }
    }
}

