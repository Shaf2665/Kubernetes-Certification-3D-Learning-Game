import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3, Animation } from '@babylonjs/core';

export type PodPhase = 'Pending' | 'Running' | 'Succeeded' | 'Failed' | 'Unknown' | 'CrashLoopBackOff' | 'Terminating';

/**
 * 3D representation of a Kubernetes Pod (robot sphere)
 */
export class PodEntity {
    private mesh: any;
    private material: StandardMaterial;
    private phase: PodPhase = 'Pending';
    private name: string;
    private scene: Scene;

    constructor(name: string, scene: Scene, position: Vector3 = Vector3.Zero()) {
        this.name = name;
        this.scene = scene;

        // Create sphere (robot-like pod)
        this.mesh = MeshBuilder.CreateSphere(`pod-${name}`, { diameter: 1.5, segments: 16 }, scene);
        this.mesh.position = position;
        this.mesh.metadata = { type: 'pod', name, entity: this };

        // Create material
        this.material = new StandardMaterial(`pod-mat-${name}`, scene);
        this.material.diffuseColor = new Color3(0.3, 0.6, 1.0); // Blue
        this.material.emissiveColor = new Color3(0.1, 0.2, 0.3);
        this.mesh.material = this.material;

        // Add floating animation
        this.createFloatingAnimation();
    }

    private createFloatingAnimation(): void {
        const animation = new Animation(
            'float',
            'position.y',
            30,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const keys = [
            { frame: 0, value: this.mesh.position.y },
            { frame: 30, value: this.mesh.position.y + 0.3 },
            { frame: 60, value: this.mesh.position.y }
        ];

        animation.setKeys(keys);
        this.mesh.animations.push(animation);
        this.scene.beginAnimation(this.mesh, 0, 60, true);
    }

    setPhase(phase: PodPhase): void {
        this.phase = phase;
        this.updateVisualState();
    }

    private updateVisualState(): void {
        switch (this.phase) {
            case 'Running':
                this.material.diffuseColor = new Color3(0.2, 0.8, 0.3); // Green
                this.material.emissiveColor = new Color3(0.05, 0.2, 0.1);
                break;
            case 'Pending':
                this.material.diffuseColor = new Color3(1.0, 0.8, 0.2); // Yellow
                this.material.emissiveColor = new Color3(0.2, 0.15, 0.05);
                break;
            case 'Failed':
            case 'CrashLoopBackOff':
                this.material.diffuseColor = new Color3(0.9, 0.2, 0.2); // Red
                this.material.emissiveColor = new Color3(0.2, 0.05, 0.05);
                break;
            case 'Terminating':
                this.material.diffuseColor = new Color3(0.5, 0.5, 0.5); // Gray
                this.material.emissiveColor = new Color3(0.1, 0.1, 0.1);
                break;
            default:
                this.material.diffuseColor = new Color3(0.3, 0.6, 1.0); // Blue
                this.material.emissiveColor = new Color3(0.1, 0.2, 0.3);
        }
    }

    getName(): string {
        return this.name;
    }

    getPhase(): PodPhase {
        return this.phase;
    }

    getMesh(): any {
        return this.mesh;
    }

    getPosition(): Vector3 {
        return this.mesh.position;
    }

    setPosition(position: Vector3): void {
        this.mesh.position = position;
    }

    dispose(): void {
        this.mesh.dispose();
        this.material.dispose();
    }
}

