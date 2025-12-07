import { ChallengeBase } from '../challenges/ChallengeBase.js';
import { Tutorial } from './Tutorial.js';

/**
 * UI controller for challenges
 */
export class ChallengeUI {
    constructor(gameSystem, certificationManager, k8sManager, achievementSystem = null) {
        this.gameSystem = gameSystem;
        this.certificationManager = certificationManager;
        this.k8sManager = k8sManager;
        this.achievementSystem = achievementSystem;
        this.currentChallenge = null;
        this.currentModule = null;
        this.tutorial = new Tutorial();
        this.init();
    }

    init() {
        this.setupEventListeners();
        
        // Listen for module selection
        document.addEventListener('module-selected', (e) => {
            this.startModule(e.detail.module, e.detail.certificationId);
        });
        
        // Listen for tutorial completion
        document.addEventListener('tutorial-complete', () => {
            if (this.currentModule && this.currentModule.challenges && this.currentModule.challenges.length > 0) {
                setTimeout(() => {
                    this.startChallenge(this.currentModule.challenges[0]);
                }, 300);
            }
        });
    }

    setupEventListeners() {
        // Challenge completion modal buttons
        document.getElementById('btn-next-challenge')?.addEventListener('click', () => {
            this.nextChallenge();
        });

        document.getElementById('btn-back-to-modules')?.addEventListener('click', () => {
            this.backToModules();
        });

        // Hint button (if exists)
        const hintButton = document.getElementById('btn-hint');
        if (hintButton) {
            hintButton.addEventListener('click', () => {
                this.showHint();
            });
        }
    }

    startModule(module, certificationId) {
        this.currentModule = module;
        this.currentCertificationId = certificationId;
        this.currentChallengeIndex = 0;
        
        // Show game screen
        const event = new CustomEvent('show-screen', {
            detail: { screen: 'game-screen' }
        });
        document.dispatchEvent(event);
        
        // Show tutorial first, then start challenge
        setTimeout(() => {
            this.tutorial.start(module);
        }, 500);
    }

    startChallenge(challengeData) {
        // Create challenge instance
        this.currentChallenge = new ChallengeBase(
            challengeData,
            this.k8sManager,
            this.gameSystem,
            this.certificationManager
        );
        
        this.currentChallenge.start();
        
        // Update UI
        this.updateChallengeDisplay();
        
        // Show terminal
        const terminalPanel = document.getElementById('terminal-panel');
        if (terminalPanel) {
            terminalPanel.classList.remove('hidden');
        }
    }

    updateChallengeDisplay() {
        if (!this.currentChallenge) return;
        
        const titleEl = document.getElementById('challenge-title');
        const descEl = document.getElementById('challenge-description');
        
        if (titleEl) titleEl.textContent = this.currentChallenge.title;
        if (descEl) descEl.textContent = this.currentChallenge.description;
        
        // Update HUD
        this.updateHUD();
    }

    updateHUD() {
        const xp = this.gameSystem.getXP();
        const level = this.gameSystem.getLevel();
        const score = this.currentChallenge ? this.currentChallenge.score : 0;
        
        const hudXP = document.getElementById('hud-xp');
        const hudLevel = document.getElementById('hud-level');
        const hudScore = document.getElementById('hud-score');
        
        if (hudXP) hudXP.textContent = `XP: ${xp.toLocaleString()}`;
        if (hudLevel) hudLevel.textContent = `Level: ${level}`;
        if (hudScore) hudScore.textContent = `Score: ${score}`;
    }

    checkChallengeCompletion(command) {
        if (!this.currentChallenge) return;
        
        const result = this.currentChallenge.validate(command);
        
        if (result.completed) {
            // Challenge completed!
            setTimeout(() => {
                this.showCompletionModal();
            }, 500);
        }
        
        return result;
    }

    showCompletionModal() {
        if (!this.currentChallenge || !this.currentChallenge.completed) return;
        
        const stats = this.currentChallenge.getStats();
        const xpEarned = stats.xpEarned;
        const stars = stats.stars;
        
        // Update modal content
        const completionScore = document.getElementById('completion-score');
        const completionXP = document.getElementById('completion-xp');
        const completionModal = document.getElementById('challenge-complete-modal');
        
        if (completionScore) completionScore.textContent = stats.score;
        if (completionXP) completionXP.textContent = `+${xpEarned}`;
        
        // Show stars
        const starsElement = document.getElementById('completion-stars');
        if (starsElement) {
            starsElement.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
        }
        
        // Show modal
        if (completionModal) {
            completionModal.classList.remove('hidden');
        }
        
        // Show XP popup
        this.showXPPopup(xpEarned);
        
        // Check for achievements
        if (this.achievementSystem) {
            this.achievementSystem.checkAchievements();
        }
    }

    showXPPopup(xpAmount) {
        const popup = document.createElement('div');
        popup.className = 'xp-popup';
        popup.textContent = `+${xpAmount} XP`;
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 2000);
    }

    nextChallenge() {
        // Hide completion modal
        const completionModal = document.getElementById('challenge-complete-modal');
        if (completionModal) {
            completionModal.classList.add('hidden');
        }
        
        if (!this.currentModule) return;
        
        // Move to next challenge
        this.currentChallengeIndex++;
        
        if (this.currentChallengeIndex < this.currentModule.challenges.length) {
            // Start next challenge
            this.startChallenge(this.currentModule.challenges[this.currentChallengeIndex]);
        } else {
            // All challenges completed - complete module
            this.completeModule();
        }
    }

    completeModule() {
        if (!this.currentModule || !this.currentCertificationId) return;
        
        // Ensure challenge is completed before getting stats
        if (!this.currentChallenge || !this.currentChallenge.completed) {
            return;
        }
        
        const stats = this.currentChallenge.getStats();
        const xpEarned = this.currentModule.xpReward || 500;
        
        // Mark module as completed
        this.certificationManager.completeModule(
            this.currentCertificationId,
            this.currentModule.id,
            xpEarned,
            stats.stars
        );
        
        // Show module completion message
        alert(`Module "${this.currentModule.title}" completed! +${xpEarned} XP`);
        
        // Go back to module menu
        this.backToModules();
    }

    backToModules() {
        // Hide completion modal
        const completionModal = document.getElementById('challenge-complete-modal');
        if (completionModal) {
            completionModal.classList.add('hidden');
        }
        
        // Show module menu
        const event = new CustomEvent('show-screen', {
            detail: { screen: 'module-menu' }
        });
        document.dispatchEvent(event);
        
        // Clear current challenge
        this.currentChallenge = null;
        this.currentModule = null;
    }

    showHint() {
        if (!this.currentChallenge) return;
        
        const hint = this.currentChallenge.getHint();
        alert(hint);
    }

    getCurrentChallenge() {
        return this.currentChallenge;
    }
}

