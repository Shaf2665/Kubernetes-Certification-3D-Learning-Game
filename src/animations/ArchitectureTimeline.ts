import { Scene, Mesh, Vector3, StandardMaterial, Color3, Animation, MeshBuilder } from '@babylonjs/core';

export interface TimelineStep {
    timeMs: number;
    callback: () => void;
    narration?: string;
    explanation?: string;
}

/**
 * Timeline-based animation system for Architecture scene
 */
export class ArchitectureTimeline {
    private scene: Scene;
    private steps: TimelineStep[] = [];
    private currentStep: number = 0;
    private startTime: number = 0;
    private isPlaying: boolean = false;
    private speed: number = 1.0;
    private meshes: Map<string, Mesh> = new Map();
    private narrationCallback?: (text: string, explanation?: string) => void;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Add a step to the timeline
     */
    step(timeMs: number, callback: () => void, narration?: string, explanation?: string): void {
        this.steps.push({ timeMs, callback, narration, explanation });
        // Sort steps by time
        this.steps.sort((a, b) => a.timeMs - b.timeMs);
    }

    /**
     * Set callback for narration
     */
    setNarrationCallback(callback: (text: string, explanation?: string) => void): void {
        this.narrationCallback = callback;
    }

    /**
     * Play the timeline
     */
    play(): void {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.startTime = Date.now();
        this.currentStep = 0;
        this.executeNextStep();
    }

    /**
     * Pause the timeline
     */
    pause(): void {
        this.isPlaying = false;
    }

    /**
     * Resume the timeline
     */
    resume(): void {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.startTime = Date.now() - (this.steps[this.currentStep]?.timeMs || 0) / this.speed;
        this.executeNextStep();
    }

    /**
     * Stop and reset the timeline
     */
    stop(): void {
        this.isPlaying = false;
        this.currentStep = 0;
        this.clearMeshes();
    }

    /**
     * Step forward one step
     */
    stepForward(): void {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            const step = this.steps[this.currentStep];
            if (step) {
                step.callback();
                if (step.narration && this.narrationCallback) {
                    this.narrationCallback(step.narration, step.explanation);
                }
            }
        }
    }

    /**
     * Step backward one step
     */
    stepBackward(): void {
        if (this.currentStep > 0) {
            this.currentStep--;
            const step = this.steps[this.currentStep];
            if (step) {
                step.callback();
                if (step.narration && this.narrationCallback) {
                    this.narrationCallback(step.narration, step.explanation);
                }
            }
        }
    }

    /**
     * Set playback speed
     */
    setSpeed(speed: number): void {
        this.speed = Math.max(0.1, Math.min(3.0, speed));
    }

    /**
     * Execute the next step in the timeline
     */
    private executeNextStep(): void {
        if (!this.isPlaying) return;

        if (this.currentStep >= this.steps.length) {
            this.isPlaying = false;
            return;
        }

        const step = this.steps[this.currentStep];
        if (!step) {
            this.isPlaying = false;
            return;
        }

        const elapsed = (Date.now() - this.startTime) * this.speed;
        const delay = step.timeMs - elapsed;

        if (delay <= 0) {
            // Execute immediately
            step.callback();
            if (step.narration && this.narrationCallback) {
                this.narrationCallback(step.narration, step.explanation);
            }
            this.currentStep++;
            this.executeNextStep();
        } else {
            // Schedule for later
            setTimeout(() => {
                if (this.isPlaying) {
                    step.callback();
                    if (step.narration && this.narrationCallback) {
                        this.narrationCallback(step.narration, step.explanation);
                    }
                    this.currentStep++;
                    this.executeNextStep();
                }
            }, delay / this.speed);
        }
    }

    /**
     * Create a mesh for a component
     */
    createComponentMesh(name: string, position: Vector3, color: Color3, size: number = 1): Mesh {
        const existing = this.meshes.get(name);
        if (existing) {
            existing.dispose();
        }

        const mesh = MeshBuilder.CreateBox(name, { size }, this.scene);
        mesh.position = position;
        const material = new StandardMaterial(`${name}Mat`, this.scene);
        material.diffuseColor = color;
        material.emissiveColor = color.scale(0.3);
        mesh.material = material;
        mesh.visibility = 0;

        this.meshes.set(name, mesh);
        return mesh;
    }

    /**
     * Show a component with fade-in
     */
    showComponent(name: string, glow: boolean = false): void {
        const mesh = this.meshes.get(name);
        if (!mesh) return;

        mesh.visibility = 1;
        
        if (glow) {
            const material = mesh.material as StandardMaterial;
            if (material) {
                material.emissiveColor = material.diffuseColor.scale(0.8);
                
                // Create pulse animation
                Animation.CreateAndStartAnimation(
                    'glow',
                    material,
                    'emissiveIntensity',
                    30,
                    30,
                    0.3,
                    0.8,
                    Animation.ANIMATIONLOOPMODE_CYCLE
                );
            }
        }
    }

    /**
     * Hide a component
     */
    hideComponent(name: string): void {
        const mesh = this.meshes.get(name);
        if (mesh) {
            mesh.visibility = 0;
        }
    }

    /**
     * Create an arrow between two components
     */
    createArrow(from: string, to: string, color: Color3 = Color3.White()): void {
        const fromMesh = this.meshes.get(from);
        const toMesh = this.meshes.get(to);
        if (!fromMesh || !toMesh) return;

        // Create a simple line arrow using a box
        const direction = toMesh.position.subtract(fromMesh.position);
        const length = direction.length();
        const midPoint = fromMesh.position.add(direction.scale(0.5));

        const arrow = MeshBuilder.CreateBox(`arrow-${from}-${to}`, {
            width: 0.1,
            height: 0.1,
            depth: length
        }, this.scene);
        
        arrow.position = midPoint;
        arrow.lookAt(toMesh.position);
        
        const material = new StandardMaterial(`arrow-${from}-${to}Mat`, this.scene);
        material.diffuseColor = color;
        material.emissiveColor = color.scale(0.5);
        arrow.material = material;
        arrow.visibility = 0;

        this.meshes.set(`arrow-${from}-${to}`, arrow);
    }

    /**
     * Show an arrow
     */
    showArrow(from: string, to: string): void {
        const arrow = this.meshes.get(`arrow-${from}-${to}`);
        if (arrow) {
            arrow.visibility = 1;
        }
    }

    /**
     * Clear all meshes
     */
    private clearMeshes(): void {
        this.meshes.forEach(mesh => mesh.dispose());
        this.meshes.clear();
    }

    /**
     * Get current step index
     */
    getCurrentStep(): number {
        return this.currentStep;
    }

    /**
     * Get total steps
     */
    getTotalSteps(): number {
        return this.steps.length;
    }
}


