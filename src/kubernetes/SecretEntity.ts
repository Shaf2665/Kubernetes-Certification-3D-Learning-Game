import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';

/**
 * 3D representation of a Kubernetes Secret (locked safe)
 */
export class SecretEntity {
    private mesh: any;
    private material: StandardMaterial;
    private name: string;

    constructor(name: string, scene: Scene, position: Vector3 = Vector3.Zero()) {
        this.name = name;

        // Create box with rounded edges (safe-like secret)
        this.mesh = MeshBuilder.CreateBox(`secret-${name}`, { 
            width: 1.8, 
            height: 1.8, 
            depth: 1.8 
        }, scene);
        this.mesh.position = position;
        this.mesh.metadata = { type: 'secret', name, entity: this };

        // Create material
        this.material = new StandardMaterial(`secret-mat-${name}`, scene);
        this.material.diffuseColor = new Color3(0.8, 0.6, 0.2); // Gold
        this.material.emissiveColor = new Color3(0.2, 0.15, 0.05);
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

    dispose(): void {
        this.mesh.dispose();
        this.material.dispose();
    }
}

