import { Scene } from '@babylonjs/core';
import { ClusterSimulator } from '../kubernetes/ClusterSimulator.js';
import { FundamentalsMissions } from './FundamentalsMissions.js';
import { ProgressTracker } from './ProgressTracker.js';

export interface Mission {
    id: number;
    title: string;
    description: string;
    objectives: string[];
    completed: boolean;
    xpReward: number;
}

/**
 * Manages mission progression and completion
 */
export class MissionsManager {
    private clusterSimulator: ClusterSimulator;
    private missions: Mission[] = [];
    private currentMissionIndex: number = 0;
    private progressTracker: ProgressTracker;

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
            
            // Don't call updateMissionDisplay here - let FundamentalsScene call it after HUD is created
            console.log('[MissionsManager] MissionsManager initialized successfully');
        } catch (err) {
            console.error('[MissionsManager] Init error:', err);
            this.missions = [];
            throw err;
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
        if (!mission || mission.completed) return;

        mission.completed = true;
        this.progressTracker.addXP(mission.xpReward);
        this.progressTracker.completeMission(mission.id);

        // Move to next mission
        if (this.currentMissionIndex < this.missions.length - 1) {
            this.currentMissionIndex++;
            this.updateMissionDisplay();
        } else {
            // All missions completed
            this.showCompletionMessage();
        }
    }

    updateMissionDisplay(): void {
        console.log('[MissionsManager] Updating mission display...');
        
        const missionNameEl = document.getElementById('mission-name');
        const missionProgressEl = document.getElementById('mission-progress');

        if (!missionNameEl || !missionProgressEl) {
            console.warn('[MissionsManager] HUD elements not found, retrying in 100ms...');
            // Retry after a short delay in case HUD is still being created
            setTimeout(() => this.updateMissionDisplay(), 100);
            return;
        }

        const currentMission = this.getCurrentMission();
        const completedCount = this.missions.filter(m => m.completed).length;

        if (currentMission) {
            missionNameEl.textContent = currentMission.title;
            console.log(`[MissionsManager] Current mission: ${currentMission.title}`);
        } else {
            missionNameEl.textContent = 'No mission available';
            console.warn('[MissionsManager] No current mission found');
        }

        missionProgressEl.textContent = `${completedCount}/${this.missions.length}`;
        console.log(`[MissionsManager] Progress: ${completedCount}/${this.missions.length}`);
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

