import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';
import { PodEntity } from './PodEntity.js';

/**
 * 3D representation of a Kubernetes ReplicaSet (controller with pod links)
 */
export class ReplicaSetEntity {
    private mesh: any;
    private material: StandardMaterial;
    private name: string;
    private replicas: number = 1;
    private pods: PodEntity[] = [];

    constructor(name: string, scene: Scene, position: Vector3 = Vector3.Zero()) {
        this.name = name;

        // Create torus (controller-like replicaset)
        this.mesh = MeshBuilder.CreateTorus(`replicaset-${name}`, {
            diameter: 2,
            thickness: 0.5,
            tessellation: 16
        }, scene);
        this.mesh.position = position;
        this.mesh.metadata = { type: 'replicaset', name, entity: this };

        // Create material
        this.material = new StandardMaterial(`replicaset-mat-${name}`, scene);
        this.material.diffuseColor = new Color3(0.7, 0.5, 0.3); // Brown
        this.material.emissiveColor = new Color3(0.15, 0.1, 0.05);
        this.mesh.material = this.material;
    }

    setReplicas(replicas: number): void {
        this.replicas = replicas;
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
    }
}

