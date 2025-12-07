import { StorageManager } from '../utils/storage.js';

/**
 * Core gamification system for XP, leveling, and points
 */
export class GameSystem {
    constructor() {
        this.state = StorageManager.load();
        this.listeners = [];
    }

    // XP and Leveling
    addXP(amount, source = 'challenge') {
        const oldLevel = this.getLevel();
        this.state.player.xp += amount;
        this.state.player.totalPoints += amount;
        
        const newLevel = this.getLevel();
        const leveledUp = newLevel > oldLevel;

        this.save();
        this.notifyListeners('xp-gained', { amount, source, leveledUp, newLevel });

        if (leveledUp) {
            this.notifyListeners('level-up', { oldLevel, newLevel });
        }

        return { xp: this.state.player.xp, level: newLevel, leveledUp };
    }

    getXP() {
        return this.state.player.xp;
    }

    getLevel() {
        // Level formula: Level = sqrt(XP / 100)
        return Math.floor(Math.sqrt(this.state.player.xp / 100)) + 1;
    }

    getXPForNextLevel() {
        const currentLevel = this.getLevel();
        const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
        const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
        return xpForNextLevel - xpForCurrentLevel;
    }

    getXPProgress() {
        const currentLevel = this.getLevel();
        const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
        const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
        const currentXP = this.state.player.xp;
        const progress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
        return Math.max(0, Math.min(100, progress));
    }

    // Points and Scoring
    addPoints(amount) {
        this.state.player.totalPoints += amount;
        this.save();
        this.notifyListeners('points-added', { amount });
        return this.state.player.totalPoints;
    }

    getPoints() {
        return this.state.player.totalPoints;
    }

    // Streak Management
    updateStreak() {
        const today = new Date().toDateString();
        const lastLogin = this.state.player.lastLoginDate;

        if (!lastLogin) {
            // First login
            this.state.player.currentStreak = 1;
        } else if (lastLogin === today) {
            // Already logged in today
            return this.state.player.currentStreak;
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastLogin === yesterdayStr) {
                // Consecutive day
                this.state.player.currentStreak += 1;
            } else {
                // Streak broken
                this.state.player.currentStreak = 1;
            }
        }

        this.state.player.lastLoginDate = today;
        this.save();
        this.notifyListeners('streak-updated', { streak: this.state.player.currentStreak });
        return this.state.player.currentStreak;
    }

    getStreak() {
        return this.state.player.currentStreak;
    }

    // Challenge completion
    completeChallenge(challengeId, score, time, stars) {
        this.state.player.challengesCompleted += 1;
        this.save();
        this.notifyListeners('challenge-completed', { challengeId, score, time, stars });
    }

    getChallengesCompleted() {
        return this.state.player.challengesCompleted;
    }

    // Calculate score with bonuses
    calculateScore(baseScore, timeBonus = 0, accuracyBonus = 0, streakMultiplier = 1) {
        let finalScore = baseScore;
        
        if (timeBonus > 0) {
            finalScore += timeBonus;
        }
        
        if (accuracyBonus > 0) {
            finalScore += accuracyBonus;
        }
        
        finalScore = Math.floor(finalScore * streakMultiplier);
        return finalScore;
    }

    // Calculate XP with multipliers
    calculateXP(baseXP, speedMultiplier = 1, perfectMultiplier = 1, streakMultiplier = 1) {
        let finalXP = baseXP;
        finalXP *= speedMultiplier;
        finalXP *= perfectMultiplier;
        finalXP *= streakMultiplier;
        return Math.floor(finalXP);
    }

    // Event listeners
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    notifyListeners(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
        }
    }

    // Save state
    save() {
        StorageManager.save(this.state);
    }

    // Get full state
    getState() {
        return { ...this.state };
    }
}

