/**
 * LocalStorage wrapper for game state persistence
 */
export class StorageManager {
    static STORAGE_KEY = 'kubernetes-game-state';

    static save(data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(this.STORAGE_KEY, serialized);
            return true;
        } catch (error) {
            console.error('Failed to save game state:', error);
            return false;
        }
    }

    static load() {
        try {
            const serialized = localStorage.getItem(this.STORAGE_KEY);
            if (serialized === null) {
                return this.getDefaultState();
            }
            return JSON.parse(serialized);
        } catch (error) {
            console.error('Failed to load game state:', error);
            return this.getDefaultState();
        }
    }

    static getDefaultState() {
        return {
            player: {
                xp: 0,
                level: 1,
                totalPoints: 0,
                challengesCompleted: 0,
                currentStreak: 0,
                lastLoginDate: null
            },
            certifications: {
                fundamentals: {
                    completed: false,
                    modulesCompleted: [],
                    xpEarned: 0,
                    progress: 0
                },
                cka: {
                    completed: false,
                    modulesCompleted: [],
                    xpEarned: 0,
                    progress: 0
                },
                ckad: {
                    completed: false,
                    modulesCompleted: [],
                    xpEarned: 0,
                    progress: 0
                }
            },
            achievements: {
                unlocked: [],
                progress: {}
            },
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                theme: 'default'
            }
        };
    }

    static clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    static export() {
        return this.load();
    }

    static import(data) {
        try {
            this.save(data);
            return true;
        } catch (error) {
            console.error('Failed to import game state:', error);
            return false;
        }
    }
}

