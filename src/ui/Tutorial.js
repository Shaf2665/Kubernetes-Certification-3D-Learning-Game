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

            // Setup navigation buttons
            document.getElementById('tutorial-prev')?.addEventListener('click', () => {
                this.previousStep();
            });

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

