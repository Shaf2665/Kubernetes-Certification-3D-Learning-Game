import { Scene, Mesh, Vector3, StandardMaterial, Color3, MeshBuilder, Animation } from '@babylonjs/core';

export interface StoryboardStep {
    id: string;
    narration: string;
    explanation?: string;
    callback: () => void;
}

/**
 * Storyboard system for Microservices animation
 */
export class MicroservicesStoryboard {
    private scene: Scene;
    private steps: StoryboardStep[] = [];
    private currentStep: number = 0;
    private isPlaying: boolean = false;
    private meshes: Map<string, Mesh> = new Map();
    private requestTokens: Mesh[] = [];
    private narrationCallback?: (text: string, explanation?: string) => void;
    private autoAdvanceTimeout: NodeJS.Timeout | null = null;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Add a storyboard step
     */
    addStep(id: string, narration: string, callback: () => void, explanation?: string): void {
        this.steps.push({ id, narration, callback, explanation });
    }

    /**
     * Set narration callback
     */
    setNarrationCallback(callback: (text: string, explanation?: string) => void): void {
        this.narrationCallback = callback;
    }

    /**
     * Play the storyboard
     */
    play(): void {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.advanceStep();
    }

    /**
     * Pause the storyboard
     */
    pause(): void {
        this.isPlaying = false;
        if (this.autoAdvanceTimeout) {
            clearTimeout(this.autoAdvanceTimeout);
            this.autoAdvanceTimeout = null;
        }
    }

    /**
     * Stop and reset
     */
    stop(): void {
        this.isPlaying = false;
        this.currentStep = 0;
        if (this.autoAdvanceTimeout) {
            clearTimeout(this.autoAdvanceTimeout);
            this.autoAdvanceTimeout = null;
        }
        this.clearMeshes();
    }

    /**
     * Go to next step
     */
    nextStep(): void {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.executeCurrentStep();
        }
    }

    /**
     * Go to previous step
     */
    previousStep(): void {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.executeCurrentStep();
        }
    }

    /**
     * Restart from beginning
     */
    restart(): void {
        this.currentStep = 0;
        this.clearMeshes();
        this.executeCurrentStep();
    }

    /**
     * Execute current step
     */
    private executeCurrentStep(): void {
        const step = this.steps[this.currentStep];
        if (!step) return;

        step.callback();
        if (this.narrationCallback) {
            this.narrationCallback(step.narration, step.explanation);
        }
    }

    /**
     * Advance to next step (auto if playing)
     */
    private advanceStep(): void {
        if (!this.isPlaying) return;

        this.executeCurrentStep();

        if (this.currentStep < this.steps.length - 1) {
            // Auto-advance after 4 seconds
            this.autoAdvanceTimeout = setTimeout(() => {
                this.currentStep++;
                this.advanceStep();
            }, 4000);
        } else {
            this.isPlaying = false;
        }
    }

    /**
     * Create a service mesh
     */
    createService(name: string, position: Vector3, color: Color3, size: number = 1): Mesh {
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
     * Show a service
     */
    showService(name: string, glow: boolean = false): void {
        const mesh = this.meshes.get(name);
        if (!mesh) return;

        mesh.visibility = 1;
        
        if (glow) {
            const material = mesh.material as StandardMaterial;
            if (material) {
                material.emissiveColor = material.diffuseColor.scale(0.8);
            }
        }
    }

    /**
     * Hide a service
     */
    hideService(name: string): void {
        const mesh = this.meshes.get(name);
        if (mesh) {
            mesh.visibility = 0;
        }
    }

    /**
     * Create an arrow between services
     */
    createArrow(from: string, to: string, color: Color3 = Color3.White()): void {
        const fromMesh = this.meshes.get(from);
        const toMesh = this.meshes.get(to);
        if (!fromMesh || !toMesh) return;

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
     * Create and animate a request token
     */
    createRequestToken(from: string, to: string, color: Color3 = Color3.White()): void {
        const fromMesh = this.meshes.get(from);
        const toMesh = this.meshes.get(to);
        if (!fromMesh || !toMesh) return;

        const token = MeshBuilder.CreateSphere('request-token', { diameter: 0.3 }, this.scene);
        token.position = fromMesh.position.clone();
        const material = new StandardMaterial('tokenMat', this.scene);
        material.diffuseColor = color;
        material.emissiveColor = color.scale(0.8);
        token.material = material;

        // Animate token moving from source to target
        const startPos = fromMesh.position.clone();
        const endPos = toMesh.position.clone();
        
        Animation.CreateAndStartAnimation(
            'token-move',
            token,
            'position',
            30,
            30,
            startPos,
            endPos,
            Animation.ANIMATIONLOOPMODE_CONSTANT,
            undefined,
            () => {
                token.dispose();
            }
        );

        this.requestTokens.push(token);
    }

    /**
     * Scale a service (for scaling animation)
     */
    scaleService(name: string, scale: number): void {
        const mesh = this.meshes.get(name);
        if (mesh) {
            Animation.CreateAndStartAnimation(
                'scale',
                mesh,
                'scaling',
                30,
                30,
                mesh.scaling,
                new Vector3(scale, scale, scale),
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );
        }
    }

    /**
     * Clear all meshes
     */
    private clearMeshes(): void {
        this.meshes.forEach(mesh => mesh.dispose());
        this.meshes.clear();
        this.requestTokens.forEach(token => token.dispose());
        this.requestTokens = [];
    }

    /**
     * Get current step
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

    /**
     * Check if playing
     */
    isPlayingNow(): boolean {
        return this.isPlaying;
    }
}

