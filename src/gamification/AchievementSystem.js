import { StorageManager } from '../utils/storage.js';

/**
 * Achievement and badge system
 */
export class AchievementSystem {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.state = StorageManager.load();
        this.achievements = this.defineAchievements();
        this.listeners = [];
    }

    defineAchievements() {
        return {
            'first-steps': {
                id: 'first-steps',
                name: 'First Steps',
                description: 'Create your first pod',
                icon: '👶',
                xpReward: 50,
                condition: (state) => state.player.challengesCompleted >= 1
            },
            'pod-master': {
                id: 'pod-master',
                name: 'Pod Master',
                description: 'Create 10 pods',
                icon: '🎯',
                xpReward: 200,
                condition: (state) => {
                    // This would need to track pod creation count
                    return false; // Placeholder
                }
            },
            'speed-demon': {
                id: 'speed-demon',
                name: 'Speed Demon',
                description: 'Complete a challenge in under 30 seconds',
                icon: '⚡',
                xpReward: 150,
                condition: (state) => false // Placeholder - would check challenge times
            },
            'perfect-score': {
                id: 'perfect-score',
                name: 'Perfect Score',
                description: 'Get 100% on 5 consecutive challenges',
                icon: '⭐',
                xpReward: 300,
                condition: (state) => false // Placeholder
            },
            'certified-fundamentals': {
                id: 'certified-fundamentals',
                name: 'Certified',
                description: 'Complete Kubernetes Fundamentals certification',
                icon: '🏆',
                xpReward: 500,
                condition: (state) => state.certifications.fundamentals.completed
            },
            'master-admin': {
                id: 'master-admin',
                name: 'Master Admin',
                description: 'Complete CKA certification',
                icon: '👑',
                xpReward: 1000,
                condition: (state) => state.certifications.cka.completed
            },
            'app-developer': {
                id: 'app-developer',
                name: 'App Developer',
                description: 'Complete CKAD certification',
                icon: '💻',
                xpReward: 1000,
                condition: (state) => state.certifications.ckad.completed
            },
            'triple-crown': {
                id: 'triple-crown',
                name: 'Triple Crown',
                description: 'Complete all three certifications',
                icon: '👑',
                xpReward: 2000,
                condition: (state) => 
                    state.certifications.fundamentals.completed &&
                    state.certifications.cka.completed &&
                    state.certifications.ckad.completed
            },
            'streak-master': {
                id: 'streak-master',
                name: 'Streak Master',
                description: 'Maintain a 7-day login streak',
                icon: '🔥',
                xpReward: 250,
                condition: (state) => state.player.currentStreak >= 7
            },
            'challenge-champion': {
                id: 'challenge-champion',
                name: 'Challenge Champion',
                description: 'Complete 50 challenges',
                icon: '🎖️',
                xpReward: 500,
                condition: (state) => state.player.challengesCompleted >= 50
            },
            'efficiency-expert': {
                id: 'efficiency-expert',
                name: 'Efficiency Expert',
                description: 'Complete challenge with minimal commands',
                icon: '🎯',
                xpReward: 200,
                condition: (state) => false // Placeholder
            }
        };
    }

    checkAchievements() {
        const state = StorageManager.load();
        const newlyUnlocked = [];

        Object.values(this.achievements).forEach(achievement => {
            const isUnlocked = this.isUnlocked(achievement.id);
            
            if (!isUnlocked && achievement.condition(state)) {
                this.unlockAchievement(achievement.id);
                newlyUnlocked.push(achievement);
            }
        });

        if (newlyUnlocked.length > 0) {
            newlyUnlocked.forEach(achievement => {
                this.notifyListeners('achievement-unlocked', achievement);
            });
        }

        return newlyUnlocked;
    }

    unlockAchievement(achievementId) {
        if (!this.state.achievements.unlocked.includes(achievementId)) {
            this.state.achievements.unlocked.push(achievementId);
            const achievement = this.achievements[achievementId];
            
            if (achievement && achievement.xpReward) {
                this.gameSystem.addXP(achievement.xpReward, 'achievement');
            }
            
            StorageManager.save(this.state);
        }
    }

    isUnlocked(achievementId) {
        return this.state.achievements.unlocked.includes(achievementId);
    }

    getAchievement(achievementId) {
        return this.achievements[achievementId];
    }

    getAllAchievements() {
        return Object.values(this.achievements);
    }

    getUnlockedAchievements() {
        return this.state.achievements.unlocked.map(id => this.achievements[id]);
    }

    getProgress(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return 0;

        const state = StorageManager.load();
        // This would calculate progress based on achievement condition
        // For now, return 0 or 100
        return this.isUnlocked(achievementId) ? 100 : 0;
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    notifyListeners(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in achievement listener:', error);
                }
            });
        }
    }
}

