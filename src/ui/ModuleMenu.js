import { CertificationManager } from '../certification/CertificationManager.js';
import { GameSystem } from '../gamification/GameSystem.js';

/**
 * Module menu UI controller
 */
export class ModuleMenu {
    constructor(certificationManager, gameSystem) {
        this.certificationManager = certificationManager;
        this.gameSystem = gameSystem;
        this.currentCertification = null;
        this.curriculum = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        
        // Listen for certification selection
        document.addEventListener('certification-selected', (e) => {
            this.loadCertification(e.detail.certificationId);
        });
    }

    setupEventListeners() {
        document.getElementById('btn-back-to-menu')?.addEventListener('click', () => {
            const event = new CustomEvent('show-screen', {
                detail: { screen: 'main-menu' }
            });
            document.dispatchEvent(event);
        });
    }

    async loadCertification(certificationId) {
        this.currentCertification = certificationId;
        
        // Load curriculum based on certification
        try {
            if (certificationId === 'fundamentals') {
                const module = await import('../certification/Fundamentals/curriculum.js');
                this.curriculum = module.fundamentalsCurriculum;
            } else if (certificationId === 'cka') {
                const module = await import('../certification/CKA/curriculum.js');
                this.curriculum = module.ckaCurriculum;
            } else if (certificationId === 'ckad') {
                const module = await import('../certification/CKAD/curriculum.js');
                this.curriculum = module.ckadCurriculum;
            }

            if (this.curriculum) {
                this.renderModules();
                this.show();
            }
        } catch (error) {
            console.error('Failed to load curriculum:', error);
        }
    }

    renderModules() {
        const moduleList = document.getElementById('module-list');
        if (!moduleList || !this.curriculum) return;

        moduleList.innerHTML = '';

        // Update header
        document.getElementById('certification-title').textContent = this.curriculum.name;
        
        const cert = this.certificationManager.getCertification(this.currentCertification);
        document.getElementById('cert-xp-value').textContent = cert.xpEarned || 0;

        // Render each module
        this.curriculum.modules.forEach(module => {
            const isCompleted = this.certificationManager.isModuleCompleted(
                this.currentCertification, 
                module.id
            );
            const isUnlocked = this.certificationManager.isModuleUnlocked(
                this.currentCertification,
                module.id
            );

            const moduleCard = document.createElement('div');
            moduleCard.className = `module-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
            moduleCard.innerHTML = `
                <div class="module-number">${module.id}</div>
                <h3>${module.title}</h3>
                <p class="module-description">${module.description}</p>
                <div class="module-stats">
                    <span class="module-xp">+${module.xpReward} XP</span>
                    <span class="module-stars">${isCompleted ? '⭐⭐⭐' : ''}</span>
                </div>
            `;

            if (isUnlocked) {
                moduleCard.style.cursor = 'pointer';
                moduleCard.addEventListener('click', () => {
                    this.selectModule(module);
                });
            } else {
                moduleCard.style.cursor = 'not-allowed';
            }

            moduleList.appendChild(moduleCard);
        });
    }

    selectModule(module) {
        // Check if module is unlocked
        if (!this.certificationManager.isModuleUnlocked(this.currentCertification, module.id)) {
            alert('Please complete the previous module first!');
            return;
        }
        
        // Emit event to start module/challenge
        const event = new CustomEvent('module-selected', {
            detail: { 
                certificationId: this.currentCertification,
                module: module
            }
        });
        document.dispatchEvent(event);
    }

    show() {
        document.getElementById('module-menu').classList.add('active');
        const event = new CustomEvent('show-screen', {
            detail: { screen: 'module-menu' }
        });
        document.dispatchEvent(event);
    }

    hide() {
        document.getElementById('module-menu').classList.remove('active');
    }
}

