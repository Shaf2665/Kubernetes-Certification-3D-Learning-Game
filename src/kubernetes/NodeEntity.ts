import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';

/**
 * 3D representation of a Kubernetes Node (server box)
 */
export class NodeEntity {
    private mesh: any;
    private material: StandardMaterial;
    private name: string;
    private pods: any[] = [];

    constructor(name: string, scene: Scene, position: Vector3 = Vector3.Zero()) {
        this.name = name;

        // Create box (server-like node)
        this.mesh = MeshBuilder.CreateBox(`node-${name}`, { width: 3, height: 2, depth: 3 }, scene);
        this.mesh.position = position;
        this.mesh.metadata = { type: 'node', name, entity: this };

        // Create material
        this.material = new StandardMaterial(`node-mat-${name}`, scene);
        this.material.diffuseColor = new Color3(0.4, 0.4, 0.5); // Gray-blue
        this.material.emissiveColor = new Color3(0.1, 0.1, 0.15);
        this.mesh.material = this.material;
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

    addPod(pod: any): void {
        this.pods.push(pod);
    }

    removePod(pod: any): void {
        const index = this.pods.indexOf(pod);
        if (index > -1) {
            this.pods.splice(index, 1);
        }
    }

    getPods(): any[] {
        return this.pods;
    }

    dispose(): void {
        this.mesh.dispose();
        this.material.dispose();
    }
}

