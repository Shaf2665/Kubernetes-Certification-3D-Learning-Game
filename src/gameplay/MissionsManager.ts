import { Scene } from '@babylonjs/core';
import { ClusterSimulator } from '../kubernetes/ClusterSimulator.js';
import { FundamentalsMissions } from './FundamentalsMissions.js';
import { ProgressTracker } from './ProgressTracker.js';
import { kubeEvents } from '../kubernetes/KubeEventEmitter.js';

export interface Mission {
    id: number;
    title: string;
    description: string;
    explanation: string;       // What this concept is and why it matters
    objectives: string[];       // Bullet points of what user should learn
    hint: string;              // A small nudge if user is stuck
    exampleCommand?: string;   // Optional example kubectl command
    completed: boolean;
    xpReward: number;
    checkCompletion?: (eventType: string, data: any) => boolean;
}

/**
 * Manages mission progression and completion
 */
export class MissionsManager {
    private clusterSimulator: ClusterSimulator;
    private missions: Mission[] = [];
    private currentMissionIndex: number = 0;
    private progressTracker: ProgressTracker;
    private hintTimer: number | null = null;

    constructor(_scene: Scene, clusterSimulator: ClusterSimulator) {
        this.clusterSimulator = clusterSimulator;
        this.progressTracker = new ProgressTracker();
    }

    async init(): Promise<void> {
        console.log('[MissionsManager] Initializing MissionsManager...');
        
        try {
            // Load fundamentals missions
            console.log('[MissionsManager] Loading missions from FundamentalsMissions...');
            this.missions = FundamentalsMissions.getMissions();
            
            if (!this.missions || this.missions.length === 0) {
                console.warn('[MissionsManager] No missions loaded. Using empty array.');
                this.missions = [];
                return;
            }
            
            console.log(`[MissionsManager] Loaded ${this.missions.length} missions`);
            
            // Validate missions
            for (const mission of this.missions) {
                if (!mission.title || !mission.description) {
                    console.error('[MissionsManager] Invalid mission found:', mission);
                }
            }
            
            // Subscribe to cluster events
            this.setupEventListeners();
            
            // Don't call updateMissionDisplay here - let FundamentalsScene call it after HUD is created
            console.log('[MissionsManager] MissionsManager initialized successfully');
        } catch (err) {
            console.error('[MissionsManager] Init error:', err);
            this.missions = [];
            throw err;
        }
    }

    private setupEventListeners(): void {
        console.log('[MissionsManager] Setting up event listeners...');
        
        // Listen for pod creation
        kubeEvents.on('podCreated', (data) => {
            console.log('[MissionsManager] Received podCreated event:', data);
            this.handleEvent('podCreated', data);
        });

        // Listen for deployment creation
        kubeEvents.on('deploymentCreated', (data) => {
            console.log('[MissionsManager] Received deploymentCreated event:', data);
            this.handleEvent('deploymentCreated', data);
        });

        // Listen for deployment scaling
        kubeEvents.on('deploymentScaled', (data) => {
            console.log('[MissionsManager] Received deploymentScaled event:', data);
            this.handleEvent('deploymentScaled', data);
        });

        // Listen for service creation
        kubeEvents.on('serviceCreated', (data) => {
            console.log('[MissionsManager] Received serviceCreated event:', data);
            this.handleEvent('serviceCreated', data);
        });

        // Listen for configmap creation
        kubeEvents.on('configMapCreated', (data) => {
            console.log('[MissionsManager] Received configMapCreated event:', data);
            this.handleEvent('configMapCreated', data);
        });

        // Listen for secret creation
        kubeEvents.on('secretCreated', (data) => {
            console.log('[MissionsManager] Received secretCreated event:', data);
            this.handleEvent('secretCreated', data);
        });
    }

    public handleEvent(eventType: string, data: any): void {
        const mission = this.getCurrentMission();
        if (!mission || mission.completed) {
            return;
        }

        console.log(`[MissionsManager] Handling event ${eventType} for mission ${mission.id}: ${mission.title}`);

        // Check if mission has a checkCompletion function
        if (mission.checkCompletion) {
            const completed = mission.checkCompletion(eventType, data);
            if (completed) {
                console.log(`[MissionsManager] Mission ${mission.id} completed!`);
                this.completeCurrentMission();
            }
        } else {
            // Fallback to old checkMissionCompletion method
            const completed = this.checkMissionCompletion(mission);
            if (completed) {
                console.log(`[MissionsManager] Mission ${mission.id} completed (fallback check)!`);
                this.completeCurrentMission();
            }
        }
    }

    getCurrentMission(): Mission | null {
        if (this.currentMissionIndex >= 0 && this.currentMissionIndex < this.missions.length) {
            return this.missions[this.currentMissionIndex];
        }
        return null;
    }

    getMissions(): Mission[] {
        return this.missions;
    }

    checkMissionCompletion(mission: Mission): boolean {
        // Check if mission objectives are met
        switch (mission.id) {
            case 1: // Create your first Pod
                return this.clusterSimulator.getPods().size > 0;
            case 2: // Scale a Deployment
                const deployments = this.clusterSimulator.getDeployments();
                for (const deployment of deployments.values()) {
                    if (deployment.getReplicas() > 1) {
                        return true;
                    }
                }
                return false;
            case 3: // Fix a crashing Pod
                // Check if there are any failed pods that were fixed
                return true; // Simplified
            case 4: // Create a Service
                return this.clusterSimulator.getAllResources().some(r => r.type === 'service');
            case 5: // Use a ConfigMap
                return this.clusterSimulator.getAllResources().some(r => r.type === 'configmap');
            case 6: // Use a Secret
                return this.clusterSimulator.getAllResources().some(r => r.type === 'secret');
            default:
                return false;
        }
    }

    completeCurrentMission(): void {
        const mission = this.getCurrentMission();
        if (!mission || mission.completed) {
            console.warn('[MissionsManager] Cannot complete mission - already completed or not found');
            return;
        }

        // Clear hint timer
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
            this.hintTimer = null;
        }

        console.log(`[MissionsManager] Completing mission ${mission.id}: ${mission.title}`);
        mission.completed = true;
        this.progressTracker.addXP(mission.xpReward);
        this.progressTracker.completeMission(mission.id);

        // Update UI immediately
        this.updateMissionDisplay();

        // Move to next mission
        if (this.currentMissionIndex < this.missions.length - 1) {
            this.currentMissionIndex++;
            console.log(`[MissionsManager] Moving to next mission: ${this.getCurrentMission()?.title}`);
            this.updateMissionDisplay();
        } else {
            // All missions completed
            console.log('[MissionsManager] All missions completed!');
            this.showCompletionMessage();
        }
    }

    updateMissionDisplay(): void {
        console.log('[MissionsManager] Updating mission display...');
        
        const missionTitleEl = document.getElementById('mission-title');
        const missionDescriptionEl = document.getElementById('mission-description');
        const missionProgressEl = document.getElementById('mission-progress');
        const missionExplanationEl = document.getElementById('mission-explanation');
        const missionObjectivesEl = document.getElementById('mission-objectives');
        const missionHintEl = document.getElementById('mission-hint');
        const missionExampleEl = document.getElementById('mission-example');
        const missionExampleCommandEl = document.getElementById('mission-example-command');
        const showHintBtn = document.getElementById('btn-show-hint');
        const explanationSection = document.getElementById('mission-explanation-section');
        const objectivesSection = document.getElementById('mission-objectives-section');
        const hintSection = document.getElementById('mission-hint-section');

        if (!missionTitleEl || !missionDescriptionEl || !missionProgressEl) {
            console.warn('[MissionsManager] HUD elements not found, retrying in 100ms...');
            setTimeout(() => this.updateMissionDisplay(), 100);
            return;
        }

        const currentMission = this.getCurrentMission();
        const completedCount = this.missions.filter(m => m.completed).length;

        if (currentMission) {
            // Update basic info
            missionTitleEl.textContent = currentMission.title;
            missionDescriptionEl.textContent = currentMission.description;
            missionProgressEl.textContent = `${completedCount}/${this.missions.length}`;

            // Update explanation
            if (missionExplanationEl && explanationSection) {
                missionExplanationEl.textContent = currentMission.explanation;
                explanationSection.style.display = 'block';
            }

            // Update objectives
            if (missionObjectivesEl && objectivesSection) {
                missionObjectivesEl.innerHTML = '';
                currentMission.objectives.forEach(objective => {
                    const li = document.createElement('li');
                    li.textContent = objective;
                    li.style.marginBottom = '4px';
                    missionObjectivesEl.appendChild(li);
                });
                objectivesSection.style.display = 'block';
            }

            // Reset hint display (hidden by default)
            if (hintSection) {
                hintSection.style.display = 'none';
            }
            if (showHintBtn) {
                showHintBtn.style.display = 'block';
            }

            // Set up hint content (but keep it hidden)
            if (missionHintEl) {
                missionHintEl.textContent = currentMission.hint;
            }
            if (missionExampleCommandEl && currentMission.exampleCommand) {
                missionExampleCommandEl.textContent = currentMission.exampleCommand;
                if (missionExampleEl) {
                    missionExampleEl.style.display = 'block';
                }
            } else if (missionExampleEl) {
                missionExampleEl.style.display = 'none';
            }

            // Start hint timer
            this.startHintTimer();

            console.log(`[MissionsManager] Current mission: ${currentMission.title}`);
        } else {
            missionTitleEl.textContent = 'No mission available';
            missionDescriptionEl.textContent = 'All missions completed!';
            console.warn('[MissionsManager] No current mission found');
        }

        console.log(`[MissionsManager] Progress: ${completedCount}/${this.missions.length}`);
    }

    private startHintTimer(): void {
        // Clear existing timer
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
        }

        // Mission timer started

        // Set up hint button click handler
        const showHintBtn = document.getElementById('btn-show-hint');
        if (showHintBtn) {
            // Remove old listeners by cloning
            const newBtn = showHintBtn.cloneNode(true) as HTMLElement;
            showHintBtn.parentNode?.replaceChild(newBtn, showHintBtn);
            
            newBtn.addEventListener('click', () => {
                this.showHint();
            });
        }

        // Auto-show hint after 20 seconds
        this.hintTimer = window.setTimeout(() => {
            console.log('[MissionsManager] Auto-showing hint after 20 seconds');
            this.showHint();
        }, 20000);
    }

    private showHint(): void {
        const hintSection = document.getElementById('mission-hint-section');
        const showHintBtn = document.getElementById('btn-show-hint');
        
        if (hintSection) {
            hintSection.style.display = 'block';
        }
        if (showHintBtn) {
            showHintBtn.style.display = 'none';
        }
        
        // Clear timer since hint is now shown
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
            this.hintTimer = null;
        }
    }

    private showCompletionMessage(): void {
        const dialog = document.getElementById('dialog-box');
        if (dialog) {
            dialog.innerHTML = `
                <h2 style="color: #4a90e2; margin-bottom: 15px;">🎉 Congratulations!</h2>
                <p style="margin-bottom: 20px; line-height: 1.6;">
                    You've completed all Kubernetes Fundamentals missions!
                </p>
                <button id="dialog-close" style="
                    background: #4a90e2;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Awesome!</button>
            `;
            dialog.style.display = 'block';

            const closeBtn = document.getElementById('dialog-close');
            closeBtn?.addEventListener('click', () => {
                dialog.style.display = 'none';
            });
        }
    }

    getProgressTracker(): ProgressTracker {
        return this.progressTracker;
    }
}

