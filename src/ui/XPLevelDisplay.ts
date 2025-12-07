/**
 * Displays XP bar, level, and progress
 */
import { ProgressionSystem } from '../gameplay/ProgressionSystem.js';

export class XPLevelDisplay {
    private container: HTMLElement | null = null;
    private progressionSystem: ProgressionSystem;

    constructor(progressionSystem: ProgressionSystem) {
        this.progressionSystem = progressionSystem;
    }

    create(): HTMLElement {
        // Remove existing display if it exists
        const existing = document.getElementById('xp-level-display');
        if (existing) {
            existing.remove();
        }

        this.container = document.createElement('div');
        this.container.id = 'xp-level-display';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.85);
            border: 2px solid #4a90e2;
            border-radius: 8px;
            padding: 15px;
            z-index: 200;
            pointer-events: none;
            min-width: 250px;
            backdrop-filter: blur(10px);
        `;

        this.update();
        return this.container;
    }

    update(): void {
        if (!this.container) return;

        const level = this.progressionSystem.getLevel();
        const progress = this.progressionSystem.getXPProgress();

        this.container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <div style="
                    background: linear-gradient(135deg, #4a90e2 0%, #5aa0f2 100%);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: bold;
                    color: white;
                    box-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
                ">${level}</div>
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 5px;">
                        <span style="color: #4a90e2; font-size: 16px; font-weight: bold;">Level ${level}</span>
                        <span style="color: #ffc107; font-size: 14px;">⭐</span>
                    </div>
                    <div style="
                        background: rgba(50, 50, 50, 0.8);
                        border-radius: 10px;
                        height: 8px;
                        overflow: hidden;
                        position: relative;
                    ">
                        <div id="xp-bar-fill" style="
                            background: linear-gradient(90deg, #4a90e2 0%, #5aa0f2 100%);
                            height: 100%;
                            width: ${Math.min(progress.progress * 100, 100)}%;
                            transition: width 0.5s ease-out;
                            box-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
                        "></div>
                    </div>
                    <div style="color: #aaa; font-size: 12px; margin-top: 3px; text-align: center;">
                        ${progress.current}/${progress.required} XP
                    </div>
                </div>
            </div>
        `;
    }

    showXPGain(xp: number): void {
        // Create floating XP notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(74, 144, 226, 0.95);
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            border: 2px solid #4a90e2;
            z-index: 600;
            pointer-events: none;
            animation: xpFloat 2s ease-out forwards;
            font-weight: bold;
        `;
        notification.textContent = `+${xp} XP`;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes xpFloat {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-50px); opacity: 0; }
            }
        `;
        if (!document.head.querySelector('#xp-float-animation')) {
            style.id = 'xp-float-animation';
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);

        // Update display
        this.update();
    }

    dispose(): void {
        if (this.container) {
            this.container.remove();
        }
    }
}

