/**
 * Manages challenge mission execution and completion
 */
import { ClusterSimulator } from '../kubernetes/ClusterSimulator.js';
import { ChallengeMission } from './ChallengeMissions.js';
import { kubeEvents } from '../kubernetes/KubeEventEmitter.js';
import { ChallengeTimer } from '../ui/ChallengeTimer.js';
import { ChallengeResultPopup } from '../ui/ChallengeResultPopup.js';
import { ProgressionSystem } from './ProgressionSystem.js';

export class ChallengeMissionManager {
    private currentChallenge: ChallengeMission | null = null;
    private challengeTimer: ChallengeTimer;
    private resultPopup: ChallengeResultPopup;
    private progressionSystem: ProgressionSystem;
    private startTime: number = 0;
    private progress: {
        podCount: number;
        deploymentReplicas: number;
        crashFixed: boolean;
        serviceExposed: boolean;
    } = {
        podCount: 0,
        deploymentReplicas: 0,
        crashFixed: false,
        serviceExposed: false
    };
    private eventListeners: Array<() => void> = [];

    constructor(_clusterSimulator: ClusterSimulator, progressionSystem: ProgressionSystem) {
        this.progressionSystem = progressionSystem;
        this.challengeTimer = new ChallengeTimer();
        this.resultPopup = new ChallengeResultPopup();
    }

    startChallenge(challenge: ChallengeMission, onComplete?: () => void): void {
        this.currentChallenge = challenge;
        this.startTime = Date.now();
        
        // Reset progress
        this.progress = {
            podCount: 0,
            deploymentReplicas: 0,
            crashFixed: false,
            serviceExposed: false
        };

        // Show timer
        this.challengeTimer.show();
        this.challengeTimer.start(challenge.targetTime, () => {
            // Time's up - challenge failed
            this.handleFailure(onComplete);
        });

        // Setup event listeners
        this.setupEventListeners();

        console.log(`[ChallengeMissionManager] Started challenge: ${challenge.title}`);
    }

    private setupEventListeners(): void {
        // Remove old listeners
        this.removeEventListeners();

        // Listen for pod creation
        const podListener = (_data: any) => {
            if (this.currentChallenge?.goal.type === 'podCreatedCount') {
                this.progress.podCount++;
                this.checkCompletion();
            }
        };
        kubeEvents.on('podCreated', podListener);
        this.eventListeners.push(() => kubeEvents.off('podCreated', podListener));

        // Listen for deployment scaling
        const scaleListener = (data: any) => {
            if (this.currentChallenge?.goal.type === 'deploymentScaled') {
                this.progress.deploymentReplicas = Math.max(
                    this.progress.deploymentReplicas,
                    data.replicas || 0
                );
                this.checkCompletion();
            }
        };
        kubeEvents.on('deploymentScaled', scaleListener);
        this.eventListeners.push(() => kubeEvents.off('deploymentScaled', scaleListener));

        // Listen for service creation (for serviceExposed)
        const serviceListener = (data: any) => {
            if (this.currentChallenge?.goal.type === 'serviceExposed') {
                if (data.type === 'NodePort') {
                    this.progress.serviceExposed = true;
                    this.checkCompletion();
                }
            }
        };
        kubeEvents.on('serviceCreated', serviceListener);
        this.eventListeners.push(() => kubeEvents.off('serviceCreated', serviceListener));

        // Note: fixCrashLoop would need special handling in ClusterSimulator
        // For now, we'll simulate it by checking pod status changes
    }

    private removeEventListeners(): void {
        this.eventListeners.forEach(remove => remove());
        this.eventListeners = [];
    }

    private checkCompletion(): void {
        if (!this.currentChallenge) return;

        let completed = false;

        switch (this.currentChallenge.goal.type) {
            case 'podCreatedCount':
                completed = this.progress.podCount >= (this.currentChallenge.goal.count || 0);
                break;
            case 'deploymentScaled':
                completed = this.progress.deploymentReplicas >= (this.currentChallenge.goal.replicas || 0);
                break;
            case 'fixCrashLoop':
                // This would need actual crash loop detection
                // For now, we'll mark as completed if a pod is created after a failure
                completed = this.progress.crashFixed;
                break;
            case 'serviceExposed':
                completed = this.progress.serviceExposed;
                break;
        }

        if (completed) {
            this.handleSuccess();
        }
    }

    private handleSuccess(): void {
        if (!this.currentChallenge) return;

        const timeTaken = (Date.now() - this.startTime) / 1000;
        this.challengeTimer.stop();

        // Award XP
        this.progressionSystem.addXP(this.currentChallenge.xpReward);

        // Unlock challenge badge
        this.unlockChallengeBadge(this.currentChallenge.id);

        // Save completion
        this.saveChallengeCompletion(this.currentChallenge.id, timeTaken);

        // Show success popup
        this.resultPopup.showSuccess(timeTaken, this.currentChallenge.xpReward, () => {
            this.cleanup();
        });

        console.log(`[ChallengeMissionManager] Challenge completed in ${timeTaken.toFixed(1)}s`);
    }

    private handleFailure(onComplete?: () => void): void {
        this.challengeTimer.stop();

        this.resultPopup.showFailure(
            () => {
                // Retry
                if (this.currentChallenge) {
                    this.startChallenge(this.currentChallenge, onComplete);
                }
            },
            () => {
                // Close
                this.cleanup();
                if (onComplete) {
                    onComplete();
                }
            }
        );

        console.log('[ChallengeMissionManager] Challenge failed - time expired');
    }

    private unlockChallengeBadge(challengeId: string): void {
        // Add challenge completion to progression
        const completedChallenges = this.getCompletedChallenges();
        if (!completedChallenges.includes(challengeId)) {
            completedChallenges.push(challengeId);
            this.saveCompletedChallenges(completedChallenges);

            // Unlock "Challenge Master" badge if first challenge completed
            if (completedChallenges.length === 1) {
                // This would be handled by ProgressionSystem
                console.log('[ChallengeMissionManager] First challenge completed!');
            }
        }
    }

    private saveChallengeCompletion(challengeId: string, timeTaken: number): void {
        try {
            const leaderboard = this.getLeaderboard();
            const existing = leaderboard.find(e => e.challengeId === challengeId);

            if (!existing || timeTaken < existing.bestTime) {
                if (existing) {
                    existing.bestTime = timeTaken;
                    existing.attempts++;
                } else {
                    leaderboard.push({
                        challengeId,
                        bestTime: timeTaken,
                        attempts: 1
                    });
                }

                localStorage.setItem('challengeLeaderboard', JSON.stringify(leaderboard));
            }
        } catch (error) {
            console.error('[ChallengeMissionManager] Failed to save leaderboard:', error);
        }
    }

    private getLeaderboard(): Array<{ challengeId: string; bestTime: number; attempts: number }> {
        try {
            const saved = localStorage.getItem('challengeLeaderboard');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    private getCompletedChallenges(): string[] {
        try {
            const saved = localStorage.getItem('challengeCompleted');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    private saveCompletedChallenges(challenges: string[]): void {
        try {
            localStorage.setItem('challengeCompleted', JSON.stringify(challenges));
        } catch (error) {
            console.error('[ChallengeMissionManager] Failed to save completed challenges:', error);
        }
    }

    private cleanup(): void {
        this.removeEventListeners();
        this.challengeTimer.hide();
        this.currentChallenge = null;
    }

    stop(): void {
        this.challengeTimer.stop();
        this.cleanup();
    }

    getBestTime(challengeId: string): number | null {
        const leaderboard = this.getLeaderboard();
        const entry = leaderboard.find(e => e.challengeId === challengeId);
        return entry ? entry.bestTime : null;
    }

    getAttempts(challengeId: string): number {
        const leaderboard = this.getLeaderboard();
        const entry = leaderboard.find(e => e.challengeId === challengeId);
        return entry ? entry.attempts : 0;
    }
}

