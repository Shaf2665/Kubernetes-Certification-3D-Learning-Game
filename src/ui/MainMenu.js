import { CertificationManager } from '../certification/CertificationManager.js';
import { GameSystem } from '../gamification/GameSystem.js';
import { AchievementSystem } from '../gamification/AchievementSystem.js';

/**
 * Main menu UI controller
 */
export class MainMenu {
    constructor(gameSystem, certificationManager, achievementSystem) {
        this.gameSystem = gameSystem;
        this.certificationManager = certificationManager;
        this.achievementSystem = achievementSystem;
        this.currentScreen = 'main-menu';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.gameSystem.updateStreak();
    }

    setupEventListeners() {
        // Certification buttons
        const btnFundamentals = document.getElementById('btn-fundamentals');
        if (btnFundamentals) {
            btnFundamentals.addEventListener('click', () => {
                this.selectCertification('fundamentals');
            });
        }

        const btnCKA = document.getElementById('btn-cka');
        if (btnCKA) {
            btnCKA.addEventListener('click', () => {
                if (this.certificationManager.isUnlocked('cka')) {
                    this.selectCertification('cka');
                }
            });
        }

        const btnCKAD = document.getElementById('btn-ckad');
        if (btnCKAD) {
            btnCKAD.addEventListener('click', () => {
                if (this.certificationManager.isUnlocked('ckad')) {
                    this.selectCertification('ckad');
                }
            });
        }

        // Footer buttons
        const btnProfile = document.getElementById('btn-profile');
        if (btnProfile) {
            btnProfile.addEventListener('click', () => {
                this.showProfile();
            });
        }

        const btnLeaderboard = document.getElementById('btn-leaderboard');
        if (btnLeaderboard) {
            btnLeaderboard.addEventListener('click', () => {
                this.showLeaderboard();
            });
        }

        // Listen for XP and level updates
        this.gameSystem.on('xp-gained', (data) => {
            this.updatePlayerStats();
        });

        this.gameSystem.on('level-up', (data) => {
            this.showLevelUpAnimation(data.newLevel);
        });

        // Listen for achievement unlocks
        this.achievementSystem.on('achievement-unlocked', (achievement) => {
            this.showAchievementUnlock(achievement);
        });
    }

    updateDisplay() {
        this.updatePlayerStats();
        this.updateCertificationCards();
        this.checkAchievements();
    }

    updatePlayerStats() {
        const xp = this.gameSystem.getXP();
        const level = this.gameSystem.getLevel();
        const badges = this.achievementSystem.getUnlockedAchievements().length;

        document.getElementById('player-level').textContent = level;
        document.getElementById('player-xp').textContent = xp.toLocaleString();
        document.getElementById('player-badges').textContent = badges;
    }

    updateCertificationCards() {
        const certifications = ['fundamentals', 'cka', 'ckad'];
        
        certifications.forEach(certId => {
            const isUnlocked = this.certificationManager.isUnlocked(certId);
            const progress = this.certificationManager.getProgress(certId);
            const cert = this.certificationManager.getCertification(certId);
            
            const card = document.querySelector(`[data-cert="${certId}"]`);
            if (!card) return; // Skip if card doesn't exist
            
            const button = document.getElementById(`btn-${certId}`);
            const progressBar = document.getElementById(`${certId}-progress`);
            const progressText = card.querySelector('.progress-text');
            
            if (isUnlocked) {
                card.classList.remove('locked');
                if (button) {
                    button.disabled = false;
                    button.classList.remove('disabled');
                    button.textContent = 'Start Learning';
                }
            } else {
                card.classList.add('locked');
                if (button) {
                    button.disabled = true;
                    button.classList.add('disabled');
                    button.textContent = 'Locked';
                }
            }
            
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${progress}% Complete`;
            }
        });
    }

    selectCertification(certificationId) {
        // Emit event for module menu to handle
        const event = new CustomEvent('certification-selected', {
            detail: { certificationId }
        });
        document.dispatchEvent(event);
    }

    showProfile() {
        const event = new CustomEvent('show-screen', {
            detail: { screen: 'profile-screen' }
        });
        document.dispatchEvent(event);
    }

    showLeaderboard() {
        // TODO: Implement leaderboard
        alert('Leaderboard coming soon!');
    }

    showLevelUpAnimation(level) {
        // Create level up overlay
        const overlay = document.createElement('div');
        overlay.className = 'level-up-overlay';
        overlay.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-title">LEVEL UP!</div>
                <div class="level-up-number">${level}</div>
                <button class="modal-button" onclick="this.closest('.level-up-overlay').remove()">Continue</button>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 3000);
    }

    showAchievementUnlock(achievement) {
        const modal = document.createElement('div');
        modal.className = 'badge-unlock-modal';
        modal.innerHTML = `
            <div class="badge-unlock-icon">${achievement.icon}</div>
            <div class="badge-unlock-title">Achievement Unlocked!</div>
            <div class="badge-unlock-name">${achievement.name}</div>
            <p>${achievement.description}</p>
            <p style="color: var(--warning-color); margin-top: 15px;">+${achievement.xpReward} XP</p>
            <button class="modal-button" onclick="this.closest('.badge-unlock-modal').remove()">Awesome!</button>
        `;
        document.body.appendChild(modal);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 5000);
    }

    checkAchievements() {
        this.achievementSystem.checkAchievements();
    }

    show() {
        document.getElementById('main-menu').classList.add('active');
        this.currentScreen = 'main-menu';
        this.updateDisplay();
    }

    hide() {
        document.getElementById('main-menu').classList.remove('active');
    }
}

