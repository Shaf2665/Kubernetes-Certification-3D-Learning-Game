/**
 * Manages XP, leveling, and rewards system
 */
export interface Reward {
    id: string;
    name: string;
    type: 'badge' | 'cosmetic' | 'feature';
    description: string;
    unlockedAt: number; // Level at which it's unlocked
}

export class ProgressionSystem {
    private xp: number = 0;
    private level: number = 1;
    private unlockedRewards: string[] = [];
    private onLevelUpCallback?: (level: number) => void;
    private onXPGainedCallback?: (xp: number, total: number) => void;

    constructor() {
        this.loadProgress();
    }

    /**
     * Add XP and check for level up
     */
    addXP(amount: number): void {
        const oldLevel = this.level;
        this.xp += amount;
        
        console.log(`[ProgressionSystem] Gained ${amount} XP. Total: ${this.xp} XP`);
        
        // Notify XP gain
        if (this.onXPGainedCallback) {
            this.onXPGainedCallback(amount, this.xp);
        }

        // Check for level up
        const newLevel = this.calculateLevel(this.xp);
        if (newLevel > oldLevel) {
            this.level = newLevel;
            this.checkRewards();
            this.saveProgress();
            
            console.log(`[ProgressionSystem] Level up! New level: ${this.level}`);
            
            if (this.onLevelUpCallback) {
                this.onLevelUpCallback(this.level);
            }
        } else {
            this.saveProgress();
        }
    }

    /**
     * Calculate level based on XP using exponential formula
     * XP_required = level^2 * 100
     */
    calculateLevel(xp: number): number {
        let level = 1;
        let requiredXP = 0;
        
        while (requiredXP <= xp) {
            level++;
            requiredXP = this.getXPRequiredForLevel(level);
        }
        
        return level - 1;
    }

    /**
     * Get XP required for a specific level
     */
    getXPRequiredForLevel(level: number): number {
        if (level <= 1) return 0;
        return Math.pow(level - 1, 2) * 100;
    }

    /**
     * Get XP required for next level
     */
    getXPForNextLevel(): number {
        return this.getXPRequiredForLevel(this.level + 1);
    }

    /**
     * Get XP progress for current level
     */
    getXPProgress(): { current: number; required: number; progress: number } {
        const currentLevelXP = this.getXPRequiredForLevel(this.level);
        const nextLevelXP = this.getXPRequiredForLevel(this.level + 1);
        const progressXP = this.xp - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        
        return {
            current: progressXP,
            required: requiredXP,
            progress: requiredXP > 0 ? progressXP / requiredXP : 1
        };
    }

    /**
     * Check and unlock rewards based on level
     */
    private checkRewards(): void {
        const rewards = this.getAvailableRewards();
        
        rewards.forEach(reward => {
            if (this.level >= reward.unlockedAt && !this.unlockedRewards.includes(reward.id)) {
                this.unlockedRewards.push(reward.id);
                console.log(`[ProgressionSystem] Unlocked reward: ${reward.name}`);
            }
        });
    }

    /**
     * Get all available rewards
     */
    getAvailableRewards(): Reward[] {
        return [
            {
                id: 'pod-master',
                name: 'Pod Master',
                type: 'badge',
                description: 'Created your first Pod',
                unlockedAt: 1
            },
            {
                id: 'deployment-defender',
                name: 'Deployment Defender',
                type: 'badge',
                description: 'Mastered Deployments',
                unlockedAt: 2
            },
            {
                id: 'service-samurai',
                name: 'Service Samurai',
                type: 'badge',
                description: 'Conquered Services',
                unlockedAt: 3
            },
            {
                id: 'storage-strategist',
                name: 'Storage Strategist',
                type: 'badge',
                description: 'Mastered Storage',
                unlockedAt: 4
            },
            {
                id: 'challenge-mode',
                name: 'Challenge Mode',
                type: 'feature',
                description: 'Unlocked Challenge Mode',
                unlockedAt: 5
            },
            {
                id: 'pod-skin-blue',
                name: 'Blue Pod Skin',
                type: 'cosmetic',
                description: 'Blue glow effect for Pods',
                unlockedAt: 3
            },
            {
                id: 'pod-skin-gold',
                name: 'Gold Pod Skin',
                type: 'cosmetic',
                description: 'Gold glow effect for Pods',
                unlockedAt: 6
            }
        ];
    }

    /**
     * Check if a reward is unlocked
     */
    hasReward(rewardId: string): boolean {
        return this.unlockedRewards.includes(rewardId);
    }

    /**
     * Check if challenge mode is unlocked
     */
    isChallengeModeUnlocked(): boolean {
        return this.level >= 5;
    }

    /**
     * Set callback for level up events
     */
    onLevelUp(callback: (level: number) => void): void {
        this.onLevelUpCallback = callback;
    }

    /**
     * Set callback for XP gain events
     */
    onXPGained(callback: (xp: number, total: number) => void): void {
        this.onXPGainedCallback = callback;
    }

    /**
     * Save progress to localStorage
     */
    private saveProgress(): void {
        try {
            const progress = {
                xp: this.xp,
                level: this.level,
                unlockedRewards: this.unlockedRewards
            };
            localStorage.setItem('kubeGameProgression', JSON.stringify(progress));
        } catch (error) {
            console.error('[ProgressionSystem] Failed to save progress:', error);
        }
    }

    /**
     * Load progress from localStorage
     */
    private loadProgress(): void {
        try {
            const saved = localStorage.getItem('kubeGameProgression');
            if (saved) {
                const progress = JSON.parse(saved);
                this.xp = progress.xp || 0;
                this.level = progress.level || 1;
                this.unlockedRewards = progress.unlockedRewards || [];
                
                // Recalculate level to ensure consistency
                const calculatedLevel = this.calculateLevel(this.xp);
                if (calculatedLevel !== this.level) {
                    this.level = calculatedLevel;
                }
            }
        } catch (error) {
            console.error('[ProgressionSystem] Failed to load progress:', error);
        }
    }

    // Getters
    getXP(): number { return this.xp; }
    getLevel(): number { return this.level; }
    getUnlockedRewards(): string[] { return [...this.unlockedRewards]; }
}

