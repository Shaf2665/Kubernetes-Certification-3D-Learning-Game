import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';
import { PodEntity } from './PodEntity.js';

/**
 * 3D representation of a Kubernetes Deployment (factory generating pods)
 */
export class DeploymentEntity {
    private mesh: any;
    private material: StandardMaterial;
    private name: string;
    private replicas: number = 1;
    private pods: PodEntity[] = [];

    constructor(name: string, scene: Scene, position: Vector3 = Vector3.Zero()) {
        this.name = name;

        // Create cylinder (factory-like deployment)
        this.mesh = MeshBuilder.CreateCylinder(`deployment-${name}`, { 
            height: 2, 
            diameter: 2.5,
            tessellation: 16 
        }, scene);
        this.mesh.position = position;
        this.mesh.metadata = { type: 'deployment', name, entity: this };

        // Create material
        this.material = new StandardMaterial(`deployment-mat-${name}`, scene);
        this.material.diffuseColor = new Color3(0.6, 0.4, 0.8); // Purple
        this.material.emissiveColor = new Color3(0.15, 0.1, 0.2);
        this.mesh.material = this.material;
    }

    setReplicas(replicas: number): void {
        this.replicas = replicas;
        // Update pod count (handled by ClusterSimulator)
    }

    getReplicas(): number {
        return this.replicas;
    }

    addPod(pod: PodEntity): void {
        this.pods.push(pod);
    }

    removePod(pod: PodEntity): void {
        const index = this.pods.indexOf(pod);
        if (index > -1) {
            this.pods.splice(index, 1);
        }
    }

    getPods(): PodEntity[] {
        return this.pods;
    }

    getName(): string {
        return this.name;
    }

    getMesh(): any {
        return this.mesh;
    }

    getPosition(): Vector3 {
        return this.mesh.position;
    }

    dispose(): void {
        this.mesh.dispose();
        this.material.dispose();
        this.pods.forEach(pod => pod.dispose());
    }
}

