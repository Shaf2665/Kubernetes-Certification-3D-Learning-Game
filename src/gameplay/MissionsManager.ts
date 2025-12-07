import { Scene } from '@babylonjs/core';
import { ClusterSimulator } from '../kubernetes/ClusterSimulator.js';
import { FundamentalsMissions } from './FundamentalsMissions.js';
import { ProgressTracker } from './ProgressTracker.js';
import { kubeEvents } from '../kubernetes/KubeEventEmitter.js';
import { ProgressionSystem } from './ProgressionSystem.js';
import { CampaignManager } from './CampaignManager.js';

export interface Mission {
    id: number;
    title: string;
    description: string;
    explanation: string;       // What this concept is and why it matters
    whyThisMatters: string;   // Why this concept is important in real-world scenarios
    objectives: string[];       // Bullet points of what user should learn
    hint: string;              // A small nudge if user is stuck
    exampleCommand?: string;   // Optional example kubectl command
    storyIntro?: string;       // Story introduction for the mission
    chapter?: number;          // Chapter this mission belongs to
    xp?: number;               // XP reward (defaults to xpReward if not set)
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
    private progressionSystem: ProgressionSystem;
    private campaignManager: CampaignManager;
    private hintTimer: number | null = null;
    private tutorialPopup: any;
    private whyThisMattersPanel: any;
    private completionAnimation: any;

    constructor(_scene: Scene, clusterSimulator: ClusterSimulator) {
        this.clusterSimulator = clusterSimulator;
        this.progressTracker = new ProgressTracker();
        this.progressionSystem = new ProgressionSystem();
        this.campaignManager = new CampaignManager();
        this.initializeUIComponents();
        this.setupProgressionCallbacks();
    }

    private setupProgressionCallbacks(): void {
        // Update campaign manager when level changes
        this.progressionSystem.onLevelUp((level) => {
            this.campaignManager.updateLevel(level);
            this.showLevelUpAnimation(level);
        });
    }

    private async initializeUIComponents(): Promise<void> {
        try {
            const { TutorialPopup } = await import('../ui/TutorialPopup.js');
            const { WhyThisMattersPanel } = await import('../ui/WhyThisMattersPanel.js');
            const { CompletionAnimation } = await import('../ui/CompletionAnimation.js');
            
            this.tutorialPopup = new TutorialPopup();
            this.whyThisMattersPanel = new WhyThisMattersPanel();
            this.completionAnimation = new CompletionAnimation();
        } catch (error) {
            console.error('[MissionsManager] Failed to initialize UI components:', error);
        }
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
        
        // Award XP through progression system
        const xpAmount = mission.xp || mission.xpReward || 50;
        this.progressionSystem.addXP(xpAmount);
        
        // Update campaign progress
        this.campaignManager.completeMission(mission.id, xpAmount);
        
        // Update progress tracker
        this.progressTracker.addXP(mission.xpReward);
        this.progressTracker.completeMission(mission.id);

        // Hide "Why This Matters" panel if visible
        if (this.whyThisMattersPanel) {
            this.whyThisMattersPanel.hide();
        }

        // Play completion animation
        if (this.completionAnimation) {
            this.completionAnimation.show(mission.title, xpAmount);
        }

        // Play success sound
        this.playSuccessSound();

        // Show XP gain notification
        this.showXPGainNotification(xpAmount);

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

            // Update explanation (collapsible)
            if (missionExplanationEl) {
                missionExplanationEl.textContent = currentMission.explanation;
            }

            // Update objectives (collapsible)
            if (missionObjectivesEl) {
                missionObjectivesEl.innerHTML = '';
                currentMission.objectives.forEach(objective => {
                    const li = document.createElement('li');
                    li.textContent = objective;
                    li.style.marginBottom = '4px';
                    missionObjectivesEl.appendChild(li);
                });
            }

            // Update hint (collapsible)
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

            // Update "Why This Matters" (collapsible)
            const whyMattersEl = document.getElementById('mission-why-matters');
            if (whyMattersEl) {
                whyMattersEl.textContent = currentMission.whyThisMatters;
            }

            // Collapse all sections when new mission starts (except title & description)
            setTimeout(() => {
                if ((window as any).toggleAllSections) {
                    (window as any).toggleAllSections(false);
                }
            }, 100);

            // Start hint timer
            this.startHintTimer();

            // Show story intro or tutorial popup for new mission
            setTimeout(() => {
                if (this.tutorialPopup) {
                    if (currentMission.storyIntro) {
                        this.tutorialPopup.showStoryIntro(currentMission.title, currentMission.storyIntro);
                    } else {
                        this.tutorialPopup.show(currentMission.title, currentMission.explanation);
                    }
                }
            }, 500);

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

        // Set up "Why This Matters" button
        const whyMattersBtn = document.getElementById('btn-why-matters');
        if (whyMattersBtn) {
            // Remove old listeners by cloning
            const newBtn = whyMattersBtn.cloneNode(true) as HTMLElement;
            whyMattersBtn.parentNode?.replaceChild(newBtn, whyMattersBtn);
            
            const currentMission = this.getCurrentMission();
            if (currentMission && this.whyThisMattersPanel) {
                newBtn.addEventListener('click', () => {
                    this.whyThisMattersPanel.toggle(currentMission.whyThisMatters);
                });
            }
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

    getProgressionSystem(): ProgressionSystem {
        return this.progressionSystem;
    }

    getCampaignManager(): CampaignManager {
        return this.campaignManager;
    }

    private showLevelUpAnimation(level: number): void {
        // Create level up animation overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 700;
            pointer-events: none;
        `;

        overlay.innerHTML = `
            <div style="text-align: center; animation: levelUpFadeIn 0.5s ease-out;">
                <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 0.6s ease-out;">⭐</div>
                <h1 style="color: #ffc107; font-size: 48px; margin: 0 0 10px 0; text-shadow: 0 0 20px rgba(255, 193, 7, 0.5);">
                    Level Up!
                </h1>
                <p style="color: #fff; font-size: 32px; margin: 0;">
                    You reached Level ${level}!
                </p>
            </div>
        `;

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes levelUpFadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-30px); }
            }
        `;
        if (!document.head.querySelector('#levelup-animations')) {
            style.id = 'levelup-animations';
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);

        // Play level up sound
        try {
            const audio = new Audio('./assets/sounds/level_up.mp3');
            audio.volume = 0.6;
            audio.play().catch(() => {});
        } catch (error) {
            console.log('[MissionsManager] Could not play level up sound:', error);
        }

        // Remove after 3 seconds
        setTimeout(() => {
            overlay.style.animation = 'levelUpFadeIn 0.3s ease-out reverse';
            setTimeout(() => overlay.remove(), 300);
        }, 3000);
    }

    private showXPGainNotification(xp: number): void {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(74, 144, 226, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            border: 2px solid #4a90e2;
            z-index: 600;
            pointer-events: none;
            animation: xpNotificationSlide 0.5s ease-out, xpNotificationFadeOut 0.5s ease-out 2s;
        `;
        notification.textContent = `+${xp} XP`;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes xpNotificationSlide {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes xpNotificationFadeOut {
                from { opacity: 1; }
                to { opacity: 0; transform: translateX(50px); }
            }
        `;
        if (!document.head.querySelector('#xp-notification-animations')) {
            style.id = 'xp-notification-animations';
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 2500);
    }

    private playSuccessSound(): void {
        try {
            // Try to play sound if file exists
            const audio = new Audio('./assets/sounds/mission_success.mp3');
            audio.volume = 0.5;
            audio.play().catch(err => {
                // Sound file might not exist, that's okay
                console.log('[MissionsManager] Sound file not found or play failed:', err);
            });
        } catch (error) {
            // Audio not supported or file missing
            console.log('[MissionsManager] Could not play sound:', error);
        }
    }
}

