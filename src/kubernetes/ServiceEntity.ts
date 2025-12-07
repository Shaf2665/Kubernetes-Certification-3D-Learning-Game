import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';

/**
 * 3D representation of a Kubernetes Service (network router)
 */
export class ServiceEntity {
    private mesh: any;
    private material: StandardMaterial;
    private name: string;
    private type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' = 'ClusterIP';

    constructor(name: string, scene: Scene, position: Vector3 = Vector3.Zero()) {
        this.name = name;

        // Create octahedron (router-like service)
        this.mesh = MeshBuilder.CreatePolyhedron(`service-${name}`, {
            type: 1, // Octahedron
            size: 1.5
        }, scene);
        this.mesh.position = position;
        this.mesh.metadata = { type: 'service', name, entity: this };

        // Create material
        this.material = new StandardMaterial(`service-mat-${name}`, scene);
        this.material.diffuseColor = new Color3(0.2, 0.8, 0.6); // Teal
        this.material.emissiveColor = new Color3(0.05, 0.2, 0.15);
        this.mesh.material = this.material;
    }

    setType(type: 'ClusterIP' | 'NodePort' | 'LoadBalancer'): void {
        this.type = type;
        // Update visual based on type
        switch (type) {
            case 'NodePort':
                this.material.diffuseColor = new Color3(0.8, 0.6, 0.2); // Orange
                break;
            case 'LoadBalancer':
                this.material.diffuseColor = new Color3(0.9, 0.3, 0.5); // Pink
                break;
            default:
                this.material.diffuseColor = new Color3(0.2, 0.8, 0.6); // Teal
        }
    }

    getName(): string {
        return this.name;
    }

    getType(): string {
        return this.type;
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

