import { GameSystem } from '../gamification/GameSystem.js';
import { CertificationManager } from '../certification/CertificationManager.js';

/**
 * Base class for all challenges
 */
export class ChallengeBase {
    constructor(challengeData, k8sManager, gameSystem, certificationManager) {
        this.id = challengeData.id;
        this.title = challengeData.title;
        this.description = challengeData.description;
        this.command = challengeData.command;
        this.hints = challengeData.hints || [];
        this.xpReward = challengeData.xpReward || 100;
        this.k8sManager = k8sManager;
        this.gameSystem = gameSystem;
        this.certificationManager = certificationManager;
        
        this.startTime = null;
        this.endTime = null;
        this.completed = false;
        this.score = 0;
        this.stars = 0;
        this.attempts = 0;
        this.hintsUsed = 0;
    }

    start() {
        this.startTime = Date.now();
        this.completed = false;
        this.attempts = 0;
        this.hintsUsed = 0;
    }

    validate(command) {
        this.attempts++;
        
        // Execute command
        const result = this.k8sManager.executeCommand(command);
        
        // Check if challenge is completed
        const isComplete = this.checkCompletion(result);
        
        if (isComplete) {
            this.complete();
        }
        
        return {
            success: result.success,
            message: result.message,
            completed: isComplete
        };
    }

    checkCompletion(result) {
        // Base implementation - check if command matches expected command
        if (!this.command) {
            // For challenges without commands, check if result was successful
            return result.success;
        }

        // Check if the executed command matches expected command
        // This is a simplified check - in production, you'd want more sophisticated validation
        const userCommand = result.message || '';
        const expectedParts = this.command.toLowerCase().split(/\s+/);
        const userParts = userCommand.toLowerCase().split(/\s+/);
        
        // Check if key parts match (resource type and name)
        let matches = 0;
        expectedParts.forEach(part => {
            if (userParts.includes(part)) {
                matches++;
            }
        });
        
        // If most key parts match and command was successful
        return result.success && matches >= Math.min(2, expectedParts.length - 1);
    }

    complete() {
        if (this.completed) return; // Already completed
        
        this.endTime = Date.now();
        this.completed = true;
        
        // Calculate score and stars
        this.calculateScore();
        
        // Award XP
        const xpEarned = this.calculateXP();
        this.gameSystem.addXP(xpEarned, 'challenge');
        
        // Record completion
        this.gameSystem.completeChallenge(this.id, this.score, this.getTime(), this.stars);
    }

    calculateScore() {
        const baseScore = 100;
        const timeBonus = this.calculateTimeBonus();
        const accuracyBonus = this.calculateAccuracyBonus();
        const efficiencyBonus = this.calculateEfficiencyBonus();
        
        this.score = this.gameSystem.calculateScore(
            baseScore,
            timeBonus,
            accuracyBonus,
            1 // No streak multiplier for now
        );
    }

    calculateTimeBonus() {
        if (!this.startTime || !this.endTime) return 0;
        
        const timeTaken = (this.endTime - this.startTime) / 1000; // seconds
        const maxTime = 300; // 5 minutes max
        const timeRatio = Math.max(0, 1 - (timeTaken / maxTime));
        
        return Math.floor(timeRatio * 50); // Max 50 points for speed
    }

    calculateAccuracyBonus() {
        // Perfect score if completed on first try
        if (this.attempts === 1) {
            return 50;
        } else if (this.attempts === 2) {
            return 25;
        }
        return 0;
    }

    calculateEfficiencyBonus() {
        // Bonus for not using hints
        if (this.hintsUsed === 0) {
            return 25;
        } else if (this.hintsUsed === 1) {
            return 10;
        }
        return 0;
    }

    calculateXP() {
        const timeTaken = this.getTime();
        const speedMultiplier = timeTaken < 60 ? 1.5 : timeTaken < 120 ? 1.2 : 1.0;
        const perfectMultiplier = this.attempts === 1 ? 2.0 : 1.0;
        const streakMultiplier = 1.0; // Can be enhanced later
        
        return this.gameSystem.calculateXP(
            this.xpReward,
            speedMultiplier,
            perfectMultiplier,
            streakMultiplier
        );
    }

    calculateStars() {
        if (!this.completed) {
            this.stars = 0;
            return 0;
        }
        
        let stars = 1; // Base star for completion
        
        // 2 stars: completed in reasonable time and with few attempts
        if (this.getTime() < 120 && this.attempts <= 2) {
            stars = 2;
        }
        
        // 3 stars: perfect completion (fast, first try, no hints)
        if (this.getTime() < 60 && this.attempts === 1 && this.hintsUsed === 0) {
            stars = 3;
        }
        
        this.stars = stars;
        return stars;
    }

    getTime() {
        if (!this.startTime) return 0;
        const end = this.endTime || Date.now();
        return Math.floor((end - this.startTime) / 1000); // seconds
    }

    getHint() {
        if (this.hintsUsed >= this.hints.length) {
            return 'No more hints available';
        }
        this.hintsUsed++;
        return this.hints[this.hintsUsed - 1];
    }

    getProgress() {
        return this.completed ? 100 : 0;
    }

    getStats() {
        return {
            id: this.id,
            title: this.title,
            completed: this.completed,
            score: this.score,
            stars: this.calculateStars(),
            time: this.getTime(),
            attempts: this.attempts,
            hintsUsed: this.hintsUsed,
            xpEarned: this.calculateXP()
        };
    }
}

