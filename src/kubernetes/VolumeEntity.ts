import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';

/**
 * 3D representation of a Kubernetes Volume (storage cube)
 */
export class VolumeEntity {
    private mesh: any;
    private material: StandardMaterial;
    private name: string;
    private size: string = '1Gi';
    private type: 'PV' | 'PVC' = 'PV';

    constructor(name: string, scene: Scene, position: Vector3 = Vector3.Zero(), type: 'PV' | 'PVC' = 'PV') {
        this.name = name;
        this.type = type;

        // Create cube (storage-like volume)
        this.mesh = MeshBuilder.CreateBox(`volume-${name}`, { 
            width: 1.5, 
            height: 1.5, 
            depth: 1.5 
        }, scene);
        this.mesh.position = position;
        this.mesh.metadata = { type: 'volume', name, entity: this, volumeType: type };

        // Create material
        this.material = new StandardMaterial(`volume-mat-${name}`, scene);
        if (type === 'PV') {
            this.material.diffuseColor = new Color3(0.5, 0.3, 0.7); // Purple
            this.material.emissiveColor = new Color3(0.1, 0.05, 0.15);
        } else {
            this.material.diffuseColor = new Color3(0.4, 0.6, 0.3); // Green
            this.material.emissiveColor = new Color3(0.1, 0.15, 0.05);
        }
        this.mesh.material = this.material;
    }

    setSize(size: string): void {
        this.size = size;
    }

    getSize(): string {
        return this.size;
    }

    getType(): 'PV' | 'PVC' {
        return this.type;
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

