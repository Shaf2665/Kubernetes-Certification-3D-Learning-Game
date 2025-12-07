/**
 * Lightweight simulator for educational theory lessons
 * Separate from main ClusterSimulator - purely for demonstration
 */
export interface TheoryPod {
    id: string;
    name: string;
    image: string;
    status: 'Pending' | 'Running' | 'Terminating';
    createdAt: number;
}

export interface TheoryReplicaSet {
    id: string;
    name: string;
    deploymentId: string;
    desired: number;
    current: number;
    pods: TheoryPod[];
}

export interface TheoryDeployment {
    id: string;
    name: string;
    replicas: number;
    image: string;
    previousImage?: string;
    replicaSetId?: string;
    createdAt: number;
}

export class TheoryClusterSimulator {
    private pods: TheoryPod[] = [];
    private deployments: TheoryDeployment[] = [];
    private replicaSets: TheoryReplicaSet[] = [];
    private reconciliationInterval: NodeJS.Timeout | null = null;
    private isPaused: boolean = false;
    private onStateChange?: (state: any) => void;
    private onLog?: (message: string) => void;

    constructor() {
        this.startReconciliationLoop();
    }

    /**
     * Create a Pod
     */
    createPod(name: string, image: string = 'nginx:latest'): TheoryPod {
        const pod: TheoryPod = {
            id: `pod-${Date.now()}`,
            name,
            image,
            status: 'Running',
            createdAt: Date.now()
        };
        this.pods.push(pod);
        this.log(`Pod "${name}" created with image ${image}`);
        this.notifyStateChange();
        return pod;
    }

    /**
     * Create a Deployment
     */
    createDeployment(name: string, replicas: number, image: string = 'nginx:latest'): TheoryDeployment {
        const deployment: TheoryDeployment = {
            id: `deploy-${Date.now()}`,
            name,
            replicas,
            image,
            createdAt: Date.now()
        };
        this.deployments.push(deployment);
        this.log(`Deployment "${name}" created with ${replicas} replicas, image ${image}`);
        this.notifyStateChange();
        return deployment;
    }

    /**
     * Scale a Deployment
     */
    scaleDeployment(name: string, newReplicas: number): boolean {
        const deployment = this.deployments.find(d => d.name === name);
        if (!deployment) {
            this.log(`Error: Deployment "${name}" not found`);
            return false;
        }

        const oldReplicas = deployment.replicas;
        deployment.replicas = newReplicas;
        this.log(`Deployment "${name}" scaled from ${oldReplicas} to ${newReplicas} replicas`);
        this.notifyStateChange();
        return true;
    }

    /**
     * Update Deployment image
     */
    updateDeploymentImage(name: string, newImage: string): boolean {
        const deployment = this.deployments.find(d => d.name === name);
        if (!deployment) {
            this.log(`Error: Deployment "${name}" not found`);
            return false;
        }

        deployment.previousImage = deployment.image;
        deployment.image = newImage;
        this.log(`Deployment "${name}" image updated from ${deployment.previousImage} to ${newImage}`);
        this.notifyStateChange();
        return true;
    }

    /**
     * Rollback Deployment
     */
    rollbackDeployment(name: string): boolean {
        const deployment = this.deployments.find(d => d.name === name);
        if (!deployment || !deployment.previousImage) {
            this.log(`Error: Cannot rollback Deployment "${name}" - no previous image`);
            return false;
        }

        const currentImage = deployment.image;
        deployment.image = deployment.previousImage;
        deployment.previousImage = currentImage;
        this.log(`Deployment "${name}" rolled back to ${deployment.image}`);
        this.notifyStateChange();
        return true;
    }

    /**
     * Pause rollout
     */
    setPauseRollout(paused: boolean): void {
        this.isPaused = paused;
        this.log(paused ? 'Rollout paused' : 'Rollout resumed');
    }

    /**
     * Get current state
     */
    getState(): { pods: TheoryPod[]; deployments: TheoryDeployment[]; replicaSets: TheoryReplicaSet[] } {
        return {
            pods: [...this.pods],
            deployments: [...this.deployments],
            replicaSets: [...this.replicaSets]
        };
    }

    /**
     * Set state change callback
     */
    setOnStateChange(callback: (state: any) => void): void {
        this.onStateChange = callback;
    }

    /**
     * Set log callback
     */
    setOnLog(callback: (message: string) => void): void {
        this.onLog = callback;
    }

    /**
     * Reconciliation loop
     */
    private startReconciliationLoop(): void {
        this.reconciliationInterval = setInterval(() => {
            if (!this.isPaused) {
                this.reconcile();
            }
        }, 800);
    }

    /**
     * Reconcile desired state
     */
    private reconcile(): void {
        // For each deployment, ensure ReplicaSet exists and matches desired replicas
        this.deployments.forEach(deployment => {
            // Find or create ReplicaSet
            let replicaSet = this.replicaSets.find(rs => rs.deploymentId === deployment.id);
            
            if (!replicaSet) {
                replicaSet = {
                    id: `rs-${Date.now()}`,
                    name: `${deployment.name}-rs`,
                    deploymentId: deployment.id,
                    desired: deployment.replicas,
                    current: 0,
                    pods: []
                };
                this.replicaSets.push(replicaSet);
                deployment.replicaSetId = replicaSet.id;
                this.log(`ReplicaSet "${replicaSet.name}" created for Deployment "${deployment.name}"`);
            }

            // Update desired count
            replicaSet.desired = deployment.replicas;

            // Create or delete pods to match desired count
            const currentPods = replicaSet.pods.filter(p => p.status === 'Running');
            const diff = replicaSet.desired - currentPods.length;

            if (diff > 0) {
                // Need more pods
                for (let i = 0; i < diff; i++) {
                    const pod = this.createPod(
                        `${deployment.name}-pod-${currentPods.length + i + 1}`,
                        deployment.image
                    );
                    replicaSet.pods.push(pod);
                }
                this.log(`ReplicaSet "${replicaSet.name}" creating ${diff} new pod(s)`);
            } else if (diff < 0) {
                // Need fewer pods
                const podsToRemove = currentPods.slice(0, Math.abs(diff));
                podsToRemove.forEach(pod => {
                    pod.status = 'Terminating';
                    const index = replicaSet.pods.indexOf(pod);
                    if (index > -1) {
                        replicaSet.pods.splice(index, 1);
                    }
                    const globalIndex = this.pods.indexOf(pod);
                    if (globalIndex > -1) {
                        this.pods.splice(globalIndex, 1);
                    }
                });
                this.log(`ReplicaSet "${replicaSet.name}" removing ${Math.abs(diff)} pod(s)`);
            }

            // Update current count
            replicaSet.current = replicaSet.pods.filter(p => p.status === 'Running').length;
        });

        this.notifyStateChange();
    }

    /**
     * Notify state change
     */
    private notifyStateChange(): void {
        if (this.onStateChange) {
            this.onStateChange(this.getState());
        }
    }

    /**
     * Log message
     */
    private log(message: string): void {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        console.log(`[TheoryClusterSimulator] ${logMessage}`);
        if (this.onLog) {
            this.onLog(logMessage);
        }
    }

    /**
     * Cleanup
     */
    dispose(): void {
        if (this.reconciliationInterval) {
            clearInterval(this.reconciliationInterval);
            this.reconciliationInterval = null;
        }
    }
}

