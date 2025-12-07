/**
 * Manages the Learning Journey onboarding flow
 */
export interface LearningJourneyProgress {
    intro: boolean;
    kubernetesOverview: boolean;
    containers: boolean;
    orchestration: boolean;
    architecture: boolean;
    setup: boolean;
    yaml: boolean;
    coreConcepts: boolean;
    networking: boolean;
    microservices: boolean;
}

export class LearningJourneyManager {
    private static readonly STORAGE_KEY = 'learningJourney';
    private progress: LearningJourneyProgress;

    constructor() {
        this.progress = this.loadProgress();
    }

    private loadProgress(): LearningJourneyProgress {
        try {
            const stored = localStorage.getItem(LearningJourneyManager.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (err) {
            console.warn('[LearningJourneyManager] Failed to load progress:', err);
        }

        // Default: all modules incomplete
        return {
            intro: false,
            kubernetesOverview: false,
            containers: false,
            orchestration: false,
            architecture: false,
            setup: false,
            yaml: false,
            coreConcepts: false,
            networking: false,
            microservices: false
        };
    }

    private saveProgress(): void {
        try {
            localStorage.setItem(LearningJourneyManager.STORAGE_KEY, JSON.stringify(this.progress));
        } catch (err) {
            console.error('[LearningJourneyManager] Failed to save progress:', err);
        }
    }

    /**
     * Mark a module as completed
     */
    completeModule(moduleName: keyof LearningJourneyProgress): void {
        this.progress[moduleName] = true;
        this.saveProgress();
        console.log(`[LearningJourneyManager] Completed module: ${moduleName}`);
    }

    /**
     * Check if a module is completed
     */
    isModuleCompleted(moduleName: keyof LearningJourneyProgress): boolean {
        return this.progress[moduleName] === true;
    }

    /**
     * Check if all modules are completed
     */
    isJourneyComplete(): boolean {
        return Object.values(this.progress).every(completed => completed === true);
    }

    /**
     * Get the next incomplete module
     */
    getNextModule(): keyof LearningJourneyProgress | null {
        const moduleOrder: (keyof LearningJourneyProgress)[] = [
            'intro',
            'kubernetesOverview',
            'containers',
            'orchestration',
            'architecture',
            'setup',
            'yaml',
            'coreConcepts',
            'networking',
            'microservices'
        ];

        for (const module of moduleOrder) {
            if (!this.progress[module]) {
                return module;
            }
        }

        return null; // All modules completed
    }

    /**
     * Get current progress as percentage
     */
    getProgressPercentage(): number {
        const total = Object.keys(this.progress).length;
        const completed = Object.values(this.progress).filter(v => v === true).length;
        return Math.round((completed / total) * 100);
    }

    /**
     * Get all progress data
     */
    getProgress(): LearningJourneyProgress {
        return { ...this.progress };
    }

    /**
     * Reset all progress (for testing/debugging)
     */
    resetProgress(): void {
        this.progress = {
            intro: false,
            kubernetesOverview: false,
            containers: false,
            orchestration: false,
            architecture: false,
            setup: false,
            yaml: false,
            coreConcepts: false,
            networking: false,
            microservices: false
        };
        this.saveProgress();
    }
}

