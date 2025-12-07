import { Scene, Vector3 } from '@babylonjs/core';
import { PodEntity } from './PodEntity.js';
import { NodeEntity } from './NodeEntity.js';
import { DeploymentEntity } from './DeploymentEntity.js';
import { ServiceEntity } from './ServiceEntity.js';
import { ConfigMapEntity } from './ConfigMapEntity.js';
import { SecretEntity } from './SecretEntity.js';
import { ReplicaSetEntity } from './ReplicaSetEntity.js';
import { VolumeEntity } from './VolumeEntity.js';
import { EventSystem } from './EventSystem.js';

export interface ClusterResource {
    name: string;
    type: string;
    entity: any;
}

/**
 * Simulates Kubernetes cluster behavior
 */
export class ClusterSimulator {
    private scene: Scene;
    private nodes: Map<string, NodeEntity> = new Map();
    private pods: Map<string, PodEntity> = new Map();
    private deployments: Map<string, DeploymentEntity> = new Map();
    private services: Map<string, ServiceEntity> = new Map();
    private configMaps: Map<string, ConfigMapEntity> = new Map();
    private secrets: Map<string, SecretEntity> = new Map();
    private replicaSets: Map<string, ReplicaSetEntity> = new Map();
    private volumes: Map<string, VolumeEntity> = new Map();
    private eventSystem: EventSystem;
    private simulationInterval: number | null = null;

    constructor(scene: Scene) {
        this.scene = scene;
        this.eventSystem = new EventSystem(scene);
    }

    async init(): Promise<void> {
        // Create initial cluster nodes
        this.createInitialNodes();
        
        // Start simulation loop
        this.startSimulation();
    }

    private createInitialNodes(): void {
        const nodePositions = [
            new Vector3(-8, 1, -8),
            new Vector3(0, 1, -8),
            new Vector3(8, 1, -8)
        ];

        nodePositions.forEach((pos, index) => {
            const nodeName = `node-${index + 1}`;
            const node = new NodeEntity(nodeName, this.scene, pos);
            this.nodes.set(nodeName, node);
        });
    }

    private startSimulation(): void {
        // Run simulation updates every 2 seconds
        this.simulationInterval = window.setInterval(() => {
            this.updatePodPhases();
            this.reconcileDeployments();
        }, 2000);
    }

    private updatePodPhases(): void {
        // Simulate pod lifecycle changes
        this.pods.forEach((pod) => {
            const phase = pod.getPhase();
            
            // Randomly transition some pods (for demo purposes)
            if (phase === 'Pending' && Math.random() > 0.7) {
                pod.setPhase('Running');
            }
        });
    }

    private reconcileDeployments(): void {
        // Ensure deployments have correct number of pods
        this.deployments.forEach((deployment) => {
            const desiredReplicas = deployment.getReplicas();
            const currentPods = deployment.getPods();
            
            if (currentPods.length < desiredReplicas) {
                // Need to create more pods
                const needed = desiredReplicas - currentPods.length;
                for (let i = 0; i < needed; i++) {
                    this.createPodForDeployment(deployment);
                }
            } else if (currentPods.length > desiredReplicas) {
                // Need to delete excess pods
                const excess = currentPods.length - desiredReplicas;
                for (let i = 0; i < excess; i++) {
                    const pod = currentPods[i];
                    this.deletePod(pod.getName());
                }
            }
        });
    }

    // kubectl command handlers
    createPod(name: string, _image: string = 'nginx'): PodEntity | null {
        if (this.pods.has(name)) {
            return null; // Pod already exists
        }

        const node = this.getAvailableNode();
        if (!node) {
            this.eventSystem.createEvent(
                `event-${Date.now()}`,
                'Warning',
                'No available nodes',
                Vector3.Zero(),
                null
            );
            return null;
        }

        const nodePos = node.getPosition();
        const podPos = new Vector3(
            nodePos.x + (Math.random() - 0.5) * 2,
            nodePos.y + 2,
            nodePos.z + (Math.random() - 0.5) * 2
        );

        const pod = new PodEntity(name, this.scene, podPos);
        pod.setPhase('Pending');
        this.pods.set(name, pod);
        node.addPod(pod);

        // Transition to Running after a delay
        setTimeout(() => {
            pod.setPhase('Running');
        }, 1000);

        return pod;
    }

    deletePod(name: string): boolean {
        const pod = this.pods.get(name);
        if (!pod) return false;

        pod.setPhase('Terminating');
        
        setTimeout(() => {
            // Remove from all nodes
            this.nodes.forEach(node => {
                node.removePod(pod);
            });
            
            // Remove from deployments/replicasets
            this.deployments.forEach(deployment => {
                deployment.removePod(pod);
            });
            this.replicaSets.forEach(rs => {
                rs.removePod(pod);
            });

            pod.dispose();
            this.pods.delete(name);
        }, 500);

        return true;
    }

    createDeployment(name: string, _image: string, replicas: number = 1): DeploymentEntity | null {
        if (this.deployments.has(name)) {
            return null;
        }

        const pos = new Vector3(
            (Math.random() - 0.5) * 10,
            1,
            (Math.random() - 0.5) * 10
        );

        const deployment = new DeploymentEntity(name, this.scene, pos);
        deployment.setReplicas(replicas);
        this.deployments.set(name, deployment);

        // Create pods for deployment
        for (let i = 0; i < replicas; i++) {
            this.createPodForDeployment(deployment);
        }

        return deployment;
    }

    private createPodForDeployment(deployment: DeploymentEntity): void {
        const pod = this.createPod(`${deployment.getName()}-pod-${Date.now()}`);
        if (pod) {
            deployment.addPod(pod);
        }
    }

    scaleDeployment(name: string, replicas: number): boolean {
        const deployment = this.deployments.get(name);
        if (!deployment) return false;

        deployment.setReplicas(replicas);
        return true;
    }

    createService(name: string, type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' = 'ClusterIP'): ServiceEntity | null {
        if (this.services.has(name)) {
            return null;
        }

        const pos = new Vector3(
            (Math.random() - 0.5) * 10,
            1,
            (Math.random() - 0.5) * 10
        );

        const service = new ServiceEntity(name, this.scene, pos);
        service.setType(type);
        this.services.set(name, service);

        return service;
    }

    createConfigMap(name: string, data: Record<string, string> = {}): ConfigMapEntity | null {
        if (this.configMaps.has(name)) {
            return null;
        }

        const pos = new Vector3(
            (Math.random() - 0.5) * 10,
            1,
            (Math.random() - 0.5) * 10
        );

        const configMap = new ConfigMapEntity(name, this.scene, pos);
        configMap.setData(data);
        this.configMaps.set(name, configMap);

        return configMap;
    }

    createSecret(name: string): SecretEntity | null {
        if (this.secrets.has(name)) {
            return null;
        }

        const pos = new Vector3(
            (Math.random() - 0.5) * 10,
            1,
            (Math.random() - 0.5) * 10
        );

        const secret = new SecretEntity(name, this.scene, pos);
        this.secrets.set(name, secret);

        return secret;
    }

    private getAvailableNode(): NodeEntity | null {
        // Return first available node
        for (const node of this.nodes.values()) {
            if (node.getPods().length < 10) { // Simple capacity check
                return node;
            }
        }
        return this.nodes.values().next().value || null;
    }

    getAllResources(): ClusterResource[] {
        const resources: ClusterResource[] = [];
        
        this.pods.forEach((pod, name) => {
            resources.push({ name, type: 'pod', entity: pod });
        });
        this.deployments.forEach((deployment, name) => {
            resources.push({ name, type: 'deployment', entity: deployment });
        });
        this.services.forEach((service, name) => {
            resources.push({ name, type: 'service', entity: service });
        });
        this.nodes.forEach((node, name) => {
            resources.push({ name, type: 'node', entity: node });
        });

        return resources;
    }

    getPods(): Map<string, PodEntity> {
        return this.pods;
    }

    getDeployments(): Map<string, DeploymentEntity> {
        return this.deployments;
    }

    getNodes(): Map<string, NodeEntity> {
        return this.nodes;
    }

    dispose(): void {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }

        this.pods.forEach(pod => pod.dispose());
        this.deployments.forEach(deployment => deployment.dispose());
        this.services.forEach(service => service.dispose());
        this.nodes.forEach(node => node.dispose());
        this.configMaps.forEach(cm => cm.dispose());
        this.secrets.forEach(secret => secret.dispose());
        this.replicaSets.forEach(rs => rs.dispose());
        this.volumes.forEach(vol => vol.dispose());
        this.eventSystem.dispose();
    }
}

