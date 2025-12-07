import { StorageManager } from '../utils/storage.js';

/**
 * Manages certification progress, unlocks, and module completion
 */
export class CertificationManager {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.state = StorageManager.load();
        this.listeners = [];
    }

    // Check if certification is unlocked
    isUnlocked(certificationId) {
        if (certificationId === 'fundamentals') {
            return true; // Always unlocked
        }
        
        // CKA and CKAD require Fundamentals completion
        return this.state.certifications.fundamentals.completed;
    }

    // Get certification progress
    getProgress(certificationId) {
        const cert = this.state.certifications[certificationId];
        if (!cert) return 0;

        // Calculate progress based on modules completed
        const totalModules = this.getTotalModules(certificationId);
        if (totalModules === 0) return 0;

        const completedModules = cert.modulesCompleted.length;
        return Math.floor((completedModules / totalModules) * 100);
    }

    // Get total modules for a certification
    getTotalModules(certificationId) {
        const moduleCounts = {
            'fundamentals': 5,
            'cka': 5,
            'ckad': 5
        };
        return moduleCounts[certificationId] || 0;
    }

    // Complete a module
    completeModule(certificationId, moduleId, xpEarned = 0, stars = 0) {
        const cert = this.state.certifications[certificationId];
        if (!cert) return false;

        if (!cert.modulesCompleted.includes(moduleId)) {
            cert.modulesCompleted.push(moduleId);
            cert.xpEarned += xpEarned;
            
            // Update progress
            cert.progress = this.getProgress(certificationId);
            
            // Check if certification is complete
            const totalModules = this.getTotalModules(certificationId);
            if (cert.modulesCompleted.length === totalModules && !cert.completed) {
                cert.completed = true;
                this.onCertificationComplete(certificationId);
            }

            this.save();
            this.notifyListeners('module-completed', { certificationId, moduleId, xpEarned, stars });
            return true;
        }
        return false;
    }

    // Check if module is completed
    isModuleCompleted(certificationId, moduleId) {
        const cert = this.state.certifications[certificationId];
        if (!cert) return false;
        return cert.modulesCompleted.includes(moduleId);
    }

    // Check if module is unlocked (previous module must be completed)
    isModuleUnlocked(certificationId, moduleId) {
        if (!this.isUnlocked(certificationId)) {
            return false;
        }

        // First module is always unlocked if certification is unlocked
        if (moduleId === 1) {
            return true;
        }

        // Check if previous module is completed
        const previousModuleId = moduleId - 1;
        return this.isModuleCompleted(certificationId, previousModuleId);
    }

    // Complete certification
    onCertificationComplete(certificationId) {
        const cert = this.state.certifications[certificationId];
        if (cert && !cert.completed) {
            cert.completed = true;
            
            // Award certification completion XP
            const xpRewards = {
                'fundamentals': 2000,
                'cka': 3000,
                'ckad': 3000
            };
            
            const xpReward = xpRewards[certificationId] || 0;
            this.gameSystem.addXP(xpReward, 'certification');
            
            this.save();
            this.notifyListeners('certification-completed', { certificationId, xpReward });
        }
    }

    // Get certification data
    getCertification(certificationId) {
        return { ...this.state.certifications[certificationId] };
    }

    // Get all certifications
    getAllCertifications() {
        return {
            fundamentals: this.getCertification('fundamentals'),
            cka: this.getCertification('cka'),
            ckad: this.getCertification('ckad')
        };
    }

    // Event listeners
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
                    console.error('Error in certification listener:', error);
                }
            });
        }
    }

    // Save state
    save() {
        StorageManager.save(this.state);
    }

    // Get state
    getState() {
        return { ...this.state };
    }
}

