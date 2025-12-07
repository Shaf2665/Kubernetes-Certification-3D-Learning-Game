/**
 * Defines Challenge Mode missions
 */
export interface ChallengeMission {
    id: string;
    title: string;
    description: string;
    targetTime: number; // seconds
    goal: {
        type: 'podCreatedCount' | 'deploymentScaled' | 'fixCrashLoop' | 'serviceExposed';
        count?: number;
        replicas?: number;
    };
    difficulty: 'Easy' | 'Medium' | 'Hard';
    xpReward: number;
}

export class ChallengeMissions {
    static getChallenges(): ChallengeMission[] {
        return [
            {
                id: 'speed_pod_creation',
                title: 'Speed Pod Creation',
                description: 'Create 3 Pods in under 30 seconds.',
                targetTime: 30,
                goal: {
                    type: 'podCreatedCount',
                    count: 3
                },
                difficulty: 'Easy',
                xpReward: 100
            },
            {
                id: 'scale_sprint',
                title: 'Scaling Sprint',
                description: 'Scale a Deployment to 10 replicas within 25 seconds.',
                targetTime: 25,
                goal: {
                    type: 'deploymentScaled',
                    replicas: 10
                },
                difficulty: 'Medium',
                xpReward: 150
            },
            {
                id: 'crash_recovery_rush',
                title: 'Crash Recovery Rush',
                description: 'Fix a CrashLoopBackOff Pod in under 20 seconds.',
                targetTime: 20,
                goal: {
                    type: 'fixCrashLoop'
                },
                difficulty: 'Hard',
                xpReward: 175
            },
            {
                id: 'service_exposure_relay',
                title: 'Service Exposure Relay',
                description: 'Expose a Service using NodePort in less than 40 seconds.',
                targetTime: 40,
                goal: {
                    type: 'serviceExposed'
                },
                difficulty: 'Medium',
                xpReward: 120
            }
        ];
    }

    static getChallenge(id: string): ChallengeMission | null {
        return this.getChallenges().find(c => c.id === id) || null;
    }
}

