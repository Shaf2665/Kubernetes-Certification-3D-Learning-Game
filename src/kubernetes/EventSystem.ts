import { Scene, Vector3, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';

export type EventType = 'Normal' | 'Warning' | 'Error';

/**
 * System for displaying Kubernetes events as floating icons
 */
export class EventSystem {
    private scene: Scene;
    private events: Map<string, any> = new Map();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    createEvent(
        name: string,
        type: EventType,
        message: string,
        targetPosition: Vector3,
        _targetObject: any
    ): void {
        // Create floating icon above target
        const icon = MeshBuilder.CreateSphere(`event-${name}`, { diameter: 0.5, segments: 8 }, this.scene);
        icon.position = targetPosition.clone();
        icon.position.y += 3; // Float above

        const material = new StandardMaterial(`event-mat-${name}`, this.scene);
        
        switch (type) {
            case 'Warning':
                material.diffuseColor = new Color3(1.0, 0.8, 0.2); // Yellow
                break;
            case 'Error':
                material.diffuseColor = new Color3(1.0, 0.2, 0.2); // Red
                break;
            default:
                material.diffuseColor = new Color3(0.2, 0.8, 0.2); // Green
        }
        
        icon.material = material;
        icon.metadata = { type: 'event', name, message, eventType: type };

        // Add pulsing animation
        this.scene.registerBeforeRender(() => {
            if (icon && icon.metadata) {
                icon.position.y = targetPosition.y + 3 + Math.sin(Date.now() / 500) * 0.2;
                icon.rotation.y += 0.02;
            }
        });

        this.events.set(name, icon);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeEvent(name);
        }, 5000);
    }

    removeEvent(name: string): void {
        const event = this.events.get(name);
        if (event) {
            event.dispose();
            this.events.delete(name);
        }
    }

    clearAllEvents(): void {
        this.events.forEach((event) => {
            event.dispose();
        });
        this.events.clear();
    }

    dispose(): void {
        this.clearAllEvents();
    }
}

