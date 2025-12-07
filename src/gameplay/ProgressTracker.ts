/**
 * Tracks player progress, XP, and achievements
 */
export class ProgressTracker {
    private xp: number = 0;
    private level: number = 1;
    private completedMissions: Set<number> = new Set();
    private xpPerLevel: number = 1000;

    constructor() {
        this.loadProgress();
    }

    addXP(amount: number): void {
        this.xp += amount;
        this.checkLevelUp();
        this.saveProgress();
    }

    private checkLevelUp(): void {
        const requiredXP = this.level * this.xpPerLevel;
        if (this.xp >= requiredXP) {
            this.level++;
            this.showLevelUpMessage();
        }
    }

    private showLevelUpMessage(): void {
        const dialog = document.getElementById('dialog-box');
        if (dialog) {
            dialog.innerHTML = `
                <h2 style="color: #4a90e2; margin-bottom: 15px;">🎉 Level Up!</h2>
                <p style="margin-bottom: 20px; line-height: 1.6;">
                    You've reached level ${this.level}!
                </p>
                <button id="dialog-close" style="
                    background: #4a90e2;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Awesome!</button>
            `;
            dialog.style.display = 'block';

            const closeBtn = document.getElementById('dialog-close');
            closeBtn?.addEventListener('click', () => {
                dialog.style.display = 'none';
            });
        }
    }

    completeMission(missionId: number): void {
        this.completedMissions.add(missionId);
        this.saveProgress();
    }

    getXP(): number {
        return this.xp;
    }

    getLevel(): number {
        return this.level;
    }

    getCompletedMissions(): number {
        return this.completedMissions.size;
    }

    private saveProgress(): void {
        const progress = {
            xp: this.xp,
            level: this.level,
            completedMissions: Array.from(this.completedMissions)
        };
        localStorage.setItem('k8s-game-progress', JSON.stringify(progress));
    }

    private loadProgress(): void {
        const saved = localStorage.getItem('k8s-game-progress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.xp = progress.xp || 0;
                this.level = progress.level || 1;
                this.completedMissions = new Set(progress.completedMissions || []);
            } catch (e) {
                console.error('Failed to load progress:', e);
            }
        }
    }

    reset(): void {
        this.xp = 0;
        this.level = 1;
        this.completedMissions.clear();
        localStorage.removeItem('k8s-game-progress');
    }
}

