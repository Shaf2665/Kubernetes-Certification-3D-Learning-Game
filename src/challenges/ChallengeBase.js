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
        this.xpEarned = undefined; // Store XP earned when completed
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
        // Improved validation: check command structure more carefully
        if (!result.success) {
            return false;
        }

        const userCommand = result.message || '';
        const expectedCommand = this.command.toLowerCase();
        
        // Extract key parts from expected command (action, resource, name)
        const expectedParts = expectedCommand.split(/\s+/).filter(p => p && p !== 'kubectl');
        const userParts = userCommand.toLowerCase().split(/\s+/).filter(p => p && p !== 'kubectl');
        
        // Must have at least the action and resource type
        if (expectedParts.length < 2 || userParts.length < 2) {
            return false;
        }
        
        // Check if action matches (create, get, delete, etc.)
        if (expectedParts[0] !== userParts[0]) {
            return false;
        }
        
        // Check if resource type matches (pod, deployment, service, etc.)
        const expectedResource = expectedParts[1];
        const userResource = userParts[1];
        
        // Handle plural/singular forms (pods vs pod)
        const resourceMatch = expectedResource === userResource || 
                             expectedResource + 's' === userResource ||
                             expectedResource === userResource + 's';
        
        if (!resourceMatch) {
            return false;
        }
        
        // If there's a name in expected command, check if it appears in user command
        if (expectedParts.length >= 3) {
            const expectedName = expectedParts[2];
            // Name should appear somewhere in user command
            if (!userCommand.toLowerCase().includes(expectedName)) {
                return false;
            }
        }
        
        return true;
    }

    complete() {
        if (this.completed) return; // Already completed
        
        this.endTime = Date.now();
        this.completed = true;
        
        // Calculate score and stars
        this.calculateScore();
        this.calculateStars(); // Calculate stars before storing
        
        // Award XP
        this.xpEarned = this.calculateXP(); // Store XP earned
        this.gameSystem.addXP(this.xpEarned, 'challenge');
        
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
        // Use cached values if available, otherwise calculate
        const stars = this.completed ? this.stars : this.calculateStars();
        const xpEarned = this.xpEarned !== undefined ? this.xpEarned : this.calculateXP();
        
        return {
            id: this.id,
            title: this.title,
            completed: this.completed,
            score: this.score,
            stars: stars,
            time: this.getTime(),
            attempts: this.attempts,
            hintsUsed: this.hintsUsed,
            xpEarned: xpEarned
        };
    }
}

