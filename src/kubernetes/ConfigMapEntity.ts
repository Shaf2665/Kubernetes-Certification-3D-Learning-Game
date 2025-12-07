import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';

/**
 * 3D representation of a Kubernetes ConfigMap (display terminal)
 */
export class ConfigMapEntity {
    private mesh: any;
    private material: StandardMaterial;
    private name: string;
    private data: Record<string, string> = {};

    constructor(name: string, scene: Scene, position: Vector3 = Vector3.Zero()) {
        this.name = name;

        // Create thin box (display-like configmap)
        this.mesh = MeshBuilder.CreateBox(`configmap-${name}`, { 
            width: 2, 
            height: 0.3, 
            depth: 2 
        }, scene);
        this.mesh.position = position;
        this.mesh.metadata = { type: 'configmap', name, entity: this };

        // Create material
        this.material = new StandardMaterial(`configmap-mat-${name}`, scene);
        this.material.diffuseColor = new Color3(0.3, 0.7, 0.9); // Cyan
        this.material.emissiveColor = new Color3(0.05, 0.15, 0.2);
        this.mesh.material = this.material;
    }

    setData(data: Record<string, string>): void {
        this.data = data;
    }

    getData(): Record<string, string> {
        return this.data;
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

