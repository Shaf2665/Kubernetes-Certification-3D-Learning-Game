import { Mission } from './MissionsManager.js';

/**
 * Defines all 15 Kubernetes Fundamentals missions
 */
export class FundamentalsMissions {
    static getMissions(): Mission[] {
        console.log('[FundamentalsMissions] Getting missions...');
        const missions = [
            {
                id: 1,
                title: 'Create your first Pod',
                description: 'Learn how to create a basic Kubernetes Pod using kubectl.',
                objectives: ['Create a pod named "my-first-pod"'],
                completed: false,
                xpReward: 100
            },
            {
                id: 2,
                title: 'Scale a Deployment',
                description: 'Create a deployment and scale it to multiple replicas.',
                objectives: ['Create a deployment', 'Scale it to 3 replicas'],
                completed: false,
                xpReward: 150
            },
            {
                id: 3,
                title: 'Fix a crashing Pod',
                description: 'Identify and fix a pod that is in CrashLoopBackOff state.',
                objectives: ['Identify the failing pod', 'Fix the issue'],
                completed: false,
                xpReward: 200
            },
            {
                id: 4,
                title: 'Create a Service',
                description: 'Expose your pods using a Kubernetes Service.',
                objectives: ['Create a ClusterIP service'],
                completed: false,
                xpReward: 150
            },
            {
                id: 5,
                title: 'Use a ConfigMap',
                description: 'Store configuration data in a ConfigMap.',
                objectives: ['Create a ConfigMap'],
                completed: false,
                xpReward: 150
            },
            {
                id: 6,
                title: 'Use a Secret',
                description: 'Store sensitive data in a Kubernetes Secret.',
                objectives: ['Create a Secret'],
                completed: false,
                xpReward: 150
            },
            {
                id: 7,
                title: 'Work with ReplicaSets',
                description: 'Understand how ReplicaSets manage pod replicas.',
                objectives: ['Observe ReplicaSet behavior'],
                completed: false,
                xpReward: 150
            },
            {
                id: 8,
                title: 'Create & switch Namespaces',
                description: 'Organize resources using namespaces.',
                objectives: ['Create a namespace', 'Switch to it'],
                completed: false,
                xpReward: 150
            },
            {
                id: 9,
                title: 'Apply resource limits',
                description: 'Set CPU and memory limits for pods.',
                objectives: ['Create a pod with resource limits'],
                completed: false,
                xpReward: 200
            },
            {
                id: 10,
                title: 'Configure probes',
                description: 'Set up liveness and readiness probes.',
                objectives: ['Configure a liveness probe'],
                completed: false,
                xpReward: 200
            },
            {
                id: 11,
                title: 'Attach a Volume',
                description: 'Add persistent storage to a pod.',
                objectives: ['Create a PVC', 'Attach it to a pod'],
                completed: false,
                xpReward: 200
            },
            {
                id: 12,
                title: 'Use affinity rules',
                description: 'Control pod scheduling with affinity.',
                objectives: ['Create a pod with node affinity'],
                completed: false,
                xpReward: 200
            },
            {
                id: 13,
                title: 'Expose an app via NodePort',
                description: 'Expose a service externally using NodePort.',
                objectives: ['Create a NodePort service'],
                completed: false,
                xpReward: 200
            },
            {
                id: 14,
                title: 'Inspect cluster events',
                description: 'Monitor and understand cluster events.',
                objectives: ['View cluster events'],
                completed: false,
                xpReward: 150
            },
            {
                id: 15,
                title: 'Final Challenge: Create a mini application stack',
                description: 'Combine everything you learned to create a complete application.',
                objectives: [
                    'Create a deployment',
                    'Create a service',
                    'Create a configmap',
                    'Scale the deployment'
                ],
                completed: false,
                xpReward: 500
            }
        ];
        
        console.log(`[FundamentalsMissions] Returning ${missions.length} missions`);
        return missions;
    }
}

