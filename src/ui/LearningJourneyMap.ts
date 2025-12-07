import { LearningJourneyManager } from '../gameplay/LearningJourneyManager.js';

/**
 * Learning Journey Map UI - Shows progress through all modules
 */
export class LearningJourneyMap {
    private container: HTMLElement;
    private journeyManager: LearningJourneyManager;

    constructor() {
        this.journeyManager = new LearningJourneyManager();
        this.container = this.createMap();
    }

    private createMap(): HTMLElement {
        const container = document.createElement('div');
        container.id = 'learning-journey-map';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(20, 10, 30, 0.95) 100%);
            z-index: 2000;
            overflow-y: auto;
            padding: 40px;
        `;

        const progress = this.journeyManager.getProgress();
        const progressPercent = this.journeyManager.getProgressPercentage();
        const nextModule = this.journeyManager.getNextModule();

        const modules = [
            { key: 'intro', name: 'Introduction', scene: 'intro' },
            { key: 'kubernetesOverview', name: 'Kubernetes Overview', scene: 'kubernetes-overview' },
            { key: 'containers', name: 'Containers', scene: 'containers' },
            { key: 'orchestration', name: 'Orchestration', scene: 'orchestration' },
            { key: 'architecture', name: 'Architecture', scene: 'architecture' },
            { key: 'setup', name: 'Kubernetes Setup', scene: 'setup' },
            { key: 'yaml', name: 'YAML Basics', scene: 'yaml' },
            { key: 'coreConcepts', name: 'Core Concepts', scene: 'core-concepts' },
            { key: 'networking', name: 'Networking', scene: 'networking' },
            { key: 'microservices', name: 'Microservices', scene: 'microservices' }
        ];

        container.innerHTML = `
            <div style="
                max-width: 1000px;
                width: 100%;
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #4a90e2;
                border-radius: 12px;
                padding: 40px;
                backdrop-filter: blur(10px);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h1 style="color: #4a90e2; font-size: 36px; margin: 0;">Learning Journey</h1>
                    <button id="btn-close-map" style="
                        background: transparent;
                        border: 1px solid #4a90e2;
                        color: #4a90e2;
                        padding: 8px 16px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Close</button>
                </div>

                <div style="margin-bottom: 30px; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #4a90e2; font-weight: bold;">Overall Progress</span>
                        <span style="color: #4a90e2; font-weight: bold;">${progressPercent}%</span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 20px;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 10px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${progressPercent}%;
                            height: 100%;
                            background: linear-gradient(90deg, #4a90e2, #5aa0f2);
                            transition: width 0.3s;
                        "></div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 15px;">
                    ${modules.map((module, index) => {
                        const isCompleted = progress[module.key as keyof typeof progress] === true;
                        const isCurrent = nextModule === module.key;
                        const isLocked = !isCompleted && !isCurrent && index > 0 && !progress[modules[index - 1].key as keyof typeof progress];
                        
                        let statusIcon = '🔒';
                        let statusColor = '#888';
                        if (isCompleted) {
                            statusIcon = '✔';
                            statusColor = '#4caf50';
                        } else if (isCurrent) {
                            statusIcon = '▶';
                            statusColor = '#4a90e2';
                        }

                        return `
                            <div style="
                                display: flex;
                                align-items: center;
                                gap: 15px;
                                padding: 15px;
                                background: ${isCurrent ? 'rgba(74, 144, 226, 0.2)' : isLocked ? 'rgba(50, 50, 50, 0.5)' : 'rgba(0, 0, 0, 0.3)'};
                                border: 2px solid ${statusColor};
                                border-radius: 8px;
                                opacity: ${isLocked ? 0.5 : 1};
                                cursor: ${isLocked ? 'not-allowed' : 'pointer'};
                                transition: all 0.3s;
                            " data-module="${module.scene}" 
                               onmouseover="${!isLocked ? `this.style.background='rgba(74, 144, 226, 0.3)'` : ''}"
                               onmouseout="${!isLocked ? `this.style.background='${isCurrent ? 'rgba(74, 144, 226, 0.2)' : 'rgba(0, 0, 0, 0.3)'}'` : ''}">
                                <div style="
                                    width: 40px;
                                    height: 40px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    background: ${statusColor};
                                    border-radius: 50%;
                                    font-size: 20px;
                                    flex-shrink: 0;
                                ">${statusIcon}</div>
                                <div style="flex: 1;">
                                    <div style="color: ${statusColor}; font-weight: bold; font-size: 18px; margin-bottom: 5px;">
                                        ${module.name}
                                    </div>
                                    <div style="color: #aaa; font-size: 14px;">
                                        ${isCompleted ? 'Completed' : isCurrent ? 'Current Module' : isLocked ? 'Locked - Complete previous modules' : 'Not started'}
                                    </div>
                                </div>
                                ${index < modules.length - 1 ? '<div style="color: #4a90e2; font-size: 24px;">→</div>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                ${this.journeyManager.isJourneyComplete() ? `
                <div style="
                    margin-top: 30px;
                    padding: 20px;
                    background: rgba(76, 175, 80, 0.1);
                    border: 2px solid #4caf50;
                    border-radius: 8px;
                    text-align: center;
                ">
                    <p style="color: #4caf50; font-size: 18px; font-weight: bold; margin: 0;">
                        🎉 Learning Journey Complete! You're ready for hands-on missions!
                    </p>
                </div>
                ` : ''}
            </div>
        `;

        document.body.appendChild(container);

        // Setup close button
        const closeBtn = document.getElementById('btn-close-map');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // Setup module click handlers
        modules.forEach(module => {
            const moduleEl = container.querySelector(`[data-module="${module.scene}"]`);
            if (moduleEl) {
                const isCompleted = progress[module.key as keyof typeof progress] === true;
                const isCurrent = nextModule === module.key;
                const moduleIndex = modules.findIndex(m => m.key === module.key);
                const isLocked = !isCompleted && !isCurrent && moduleIndex > 0 && !progress[modules[moduleIndex - 1].key as keyof typeof progress];

                if (!isLocked) {
                    moduleEl.addEventListener('click', () => {
                        this.hide();
                        document.dispatchEvent(new CustomEvent('scene-change', { 
                            detail: { scene: module.scene } 
                        }));
                    });
                }
            }
        });

        return container;
    }

    show(): void {
        // Recreate map to get latest progress
        if (this.container.parentNode) {
            this.container.remove();
        }
        this.container = this.createMap();
    }

    hide(): void {
        if (this.container && this.container.parentNode) {
            this.container.style.display = 'none';
        }
    }

    toggle(): void {
        if (this.container.style.display === 'none' || !this.container.parentNode) {
            this.show();
        } else {
            this.hide();
        }
    }
}

