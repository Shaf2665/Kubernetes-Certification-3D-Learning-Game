import { YAMLExercises, YAMLExercise } from '../gameplay/YAMLExercises.js';
import { ProgressionSystem } from '../gameplay/ProgressionSystem.js';
import * as yaml from 'js-yaml';

/**
 * Manages YAML exercise execution, validation, and progression
 */
export class YAMLExerciseRunner {
    private currentExercise: YAMLExercise | null = null;
    private hintsUsed: number = 0;
    private progressionSystem: ProgressionSystem;
    private onSuccess?: (exercise: YAMLExercise, xpEarned: number) => void;
    private onError?: (errors: string[]) => void;

    constructor() {
        this.progressionSystem = new ProgressionSystem();
    }

    setOnSuccess(callback: (exercise: YAMLExercise, xpEarned: number) => void): void {
        this.onSuccess = callback;
    }

    setOnError(callback: (errors: string[]) => void): void {
        this.onError = callback;
    }

    loadExercise(exerciseId: string): YAMLExercise | null {
        this.currentExercise = YAMLExercises.getExerciseById(exerciseId) || null;
        this.hintsUsed = 0;
        return this.currentExercise;
    }

    getCurrentExercise(): YAMLExercise | null {
        return this.currentExercise;
    }

    getNextHint(): string | null {
        if (!this.currentExercise) return null;
        if (this.hintsUsed >= this.currentExercise.hints.length) return null;
        this.hintsUsed++;
        return this.currentExercise.hints[this.hintsUsed - 1];
    }

    getHintsUsed(): number {
        return this.hintsUsed;
    }

    getRemainingHints(): number {
        if (!this.currentExercise) return 0;
        return this.currentExercise.hints.length - this.hintsUsed;
    }

    validateYAML(yamlText: string): { valid: boolean; errors: string[]; parsed?: any } {
        if (!this.currentExercise) {
            return { valid: false, errors: ['No exercise loaded'] };
        }

        // Parse YAML
        let parsed: any;
        try {
            // Handle multi-document YAML
            if (yamlText.includes('---')) {
                parsed = yaml.loadAll(yamlText);
            } else {
                parsed = yaml.load(yamlText);
            }
        } catch (err: any) {
            return { 
                valid: false, 
                errors: [`YAML Parse Error: ${err.message}`] 
            };
        }

        // Validate using exercise validator
        const result = this.currentExercise.solutionValidator(parsed);
        
        if (result.valid) {
            // Calculate XP (reduced by hints)
            const xpReduction = this.hintsUsed * 0.1; // 10% per hint
            const xpEarned = Math.max(1, Math.round(this.currentExercise.xpReward * (1 - xpReduction)));
            
            // Award XP
            this.progressionSystem.addXP(xpEarned);
            // Level up check happens automatically in addXP

            if (this.onSuccess) {
                this.onSuccess(this.currentExercise, xpEarned);
            }

            return { valid: true, errors: [], parsed };
        } else {
            if (this.onError) {
                this.onError(result.errors);
            }
            return { valid: false, errors: result.errors, parsed };
        }
    }

    reset(): void {
        this.currentExercise = null;
        this.hintsUsed = 0;
    }
}

