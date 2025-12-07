/**
 * Tutorial system for step-by-step guidance
 */
export class Tutorial {
    constructor() {
        this.currentStep = 0;
        this.steps = [];
        this.active = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('btn-close-tutorial')?.addEventListener('click', () => {
            this.hide();
        });
    }

    start(module) {
        this.steps = this.generateSteps(module);
        this.currentStep = 0;
        this.active = true;
        this.show();
        this.showStep(0);
    }

    generateSteps(module) {
        const steps = [];
        
        // Check if this is the first module (show welcome tutorial)
        const isFirstModule = module.id === 1;
        
        if (isFirstModule) {
            // Welcome step for first-time users
            steps.push({
                title: '🎮 Welcome to Kubernetes Learning Game!',
                content: this.formatWelcomeStep(),
                type: 'welcome'
            });
            
            // How to play step
            steps.push({
                title: '📖 How to Play',
                content: this.formatHowToPlay(),
                type: 'guide'
            });
        }
        
        // Introduction step
        steps.push({
            title: `Welcome to ${module.title}`,
            content: module.description,
            type: 'info'
        });

        // Learning objectives
        if (module.learningObjectives && module.learningObjectives.length > 0) {
            steps.push({
                title: 'Learning Objectives',
                content: this.formatObjectives(module.learningObjectives),
                type: 'objectives'
            });
        }

        // Challenge overview
        if (module.challenges && module.challenges.length > 0) {
            steps.push({
                title: 'Challenges in This Module',
                content: this.formatChallenges(module.challenges),
                type: 'challenges'
            });
        }

        return steps;
    }

    formatWelcomeStep() {
        return `
            <div class="tutorial-welcome">
                <p>Welcome! This interactive 3D game will help you master Kubernetes through hands-on practice.</p>
                <p><strong>What you'll do:</strong></p>
                <ul class="tutorial-list">
                    <li>Complete challenges by typing kubectl commands</li>
                    <li>Watch your Kubernetes cluster change in 3D</li>
                    <li>Earn XP, stars, and achievements</li>
                    <li>Progress through modules to unlock certifications</li>
                </ul>
            </div>
        `;
    }

    formatHowToPlay() {
        return `
            <div class="tutorial-guide">
                <div class="guide-section">
                    <h4>🎯 Completing Challenges</h4>
                    <ul class="tutorial-list">
                        <li>Read the challenge description in the bottom-left panel</li>
                        <li>Press <strong>`</strong> (backtick) to open the terminal</li>
                        <li>Type kubectl commands to complete the task</li>
                        <li>Watch the 3D cluster update in real-time</li>
                    </ul>
                </div>
                <div class="guide-section">
                    <h4>⌨️ Controls</h4>
                    <ul class="tutorial-list">
                        <li><strong>`</strong> key - Open/Close terminal</li>
                        <li><strong>⏸</strong> button - Pause game</li>
                        <li><strong>📋</strong> button - View tasks</li>
                    </ul>
                </div>
                <div class="guide-section">
                    <h4>⭐ Scoring</h4>
                    <ul class="tutorial-list">
                        <li>Complete challenges quickly for more stars</li>
                        <li>Earn 1-3 stars based on performance</li>
                        <li>Gain XP to level up</li>
                    </ul>
                </div>
            </div>
        `;
    }

    formatObjectives(objectives) {
        return `<ul class="tutorial-list">${objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>`;
    }

    formatChallenges(challenges) {
        return challenges.map((challenge, index) => 
            `<div class="tutorial-challenge-item">
                <strong>Challenge ${index + 1}:</strong> ${challenge.title}<br>
                <em>${challenge.description}</em>
            </div>`
        ).join('');
    }

    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            this.hide();
            return;
        }

        const step = this.steps[stepIndex];
        const content = document.getElementById('tutorial-content');
        
        if (content) {
            // Remove old event listeners by using event delegation or clearing innerHTML first
            content.innerHTML = `
                <h3>${step.title}</h3>
                <div class="tutorial-step-content">${step.content}</div>
                <div class="tutorial-navigation">
                    <button id="tutorial-prev" class="tutorial-nav-btn" ${stepIndex === 0 ? 'disabled' : ''}>
                        ← Previous
                    </button>
                    <span class="tutorial-step-indicator">
                        Step ${stepIndex + 1} of ${this.steps.length}
                    </span>
                    <button id="tutorial-next" class="tutorial-nav-btn">
                        ${stepIndex === this.steps.length - 1 ? 'Start Challenges' : 'Next →'}
                    </button>
                </div>
            `;

            // Setup navigation buttons with event delegation to prevent memory leaks
            const prevBtn = document.getElementById('tutorial-prev');
            const nextBtn = document.getElementById('tutorial-next');
            
            if (prevBtn) {
                // Remove old listener if exists, then add new one
                prevBtn.replaceWith(prevBtn.cloneNode(true));
                document.getElementById('tutorial-prev')?.addEventListener('click', () => {
                    this.previousStep();
                });
            }

            if (nextBtn) {
                // Remove old listener if exists, then add new one
                nextBtn.replaceWith(nextBtn.cloneNode(true));
                document.getElementById('tutorial-next')?.addEventListener('click', () => {
                    if (stepIndex === this.steps.length - 1) {
                        this.hide();
                        // Emit tutorial complete event
                        const event = new CustomEvent('tutorial-complete');
                        document.dispatchEvent(event);
                    } else {
                        this.nextStep();
                    }
                });
            }
        }
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    show() {
        const panel = document.getElementById('tutorial-panel');
        if (panel) {
            panel.classList.remove('hidden');
        }
    }

    hide() {
        const panel = document.getElementById('tutorial-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
        this.active = false;
    }

    showHint(hintText) {
        const content = document.getElementById('tutorial-content');
        if (content) {
            content.innerHTML = `
                <h3>💡 Hint</h3>
                <div class="tutorial-hint-content">${hintText}</div>
                <button class="tutorial-close-hint modal-button">Got it!</button>
            `;

            document.querySelector('.tutorial-close-hint')?.addEventListener('click', () => {
                this.hide();
            });
        }
        this.show();
    }
}

