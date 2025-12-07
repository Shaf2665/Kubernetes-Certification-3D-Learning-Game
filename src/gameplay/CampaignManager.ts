/**
 * Manages story-based campaign progression
 */
export interface Chapter {
    id: number;
    title: string;
    description: string;
    storyIntro: string;
    missionIds: number[];
    unlockLevel?: number;
    unlockXP?: number;
}

export class CampaignManager {
    private currentChapter: number = 1;
    private completedMissions: Set<number> = new Set();
    private totalXP: number = 0;
    private level: number = 1;

    constructor() {
        this.loadProgress();
    }

    /**
     * Get all campaign chapters
     */
    getChapters(): Chapter[] {
        return [
            {
                id: 1,
                title: 'The Pod Awakens',
                description: 'Begin your journey by understanding the fundamental building blocks of Kubernetes.',
                storyIntro: 'In the quiet void of the cluster, your journey begins. The first spark of life must be awakened—a Pod, the smallest unit of existence in the Kubernetes realm.',
                missionIds: [1, 2, 3],
                unlockLevel: 1,
                unlockXP: 0
            },
            {
                id: 2,
                title: 'The Rise of Deployments',
                description: 'Learn to manage and scale your applications with Deployments.',
                storyIntro: 'As your Pods multiply, order must be established. Deployments rise to bring structure and resilience to your growing cluster.',
                missionIds: [4, 5, 6],
                unlockLevel: 2,
                unlockXP: 200
            },
            {
                id: 3,
                title: 'Secrets of Configuration',
                description: 'Master configuration management with ConfigMaps and Secrets.',
                storyIntro: 'The cluster holds secrets and configurations. Master these, and you will have the power to adapt your applications to any environment.',
                missionIds: [7, 8, 9],
                unlockLevel: 3,
                unlockXP: 500
            },
            {
                id: 4,
                title: 'The Battle of Services',
                description: 'Connect your applications with Services and networking.',
                storyIntro: 'In the network battlefield, Services emerge as the guardians of connectivity. They ensure your applications can communicate and be discovered.',
                missionIds: [10, 11, 12],
                unlockLevel: 4,
                unlockXP: 900
            },
            {
                id: 5,
                title: 'The Storage Frontier',
                description: 'Explore persistent storage and volumes.',
                storyIntro: 'Beyond ephemeral containers lies the storage frontier. Here, data persists, volumes bind, and stateful applications find their home.',
                missionIds: [13, 14],
                unlockLevel: 5,
                unlockXP: 1400
            },
            {
                id: 6,
                title: 'The Scheduler Trials',
                description: 'Master advanced scheduling with affinity and resource management.',
                storyIntro: 'The Scheduler holds the power to place Pods wisely. Master its trials, and you will control the very placement of your workloads.',
                missionIds: [15],
                unlockLevel: 6,
                unlockXP: 2000
            },
            {
                id: 7,
                title: 'Guardians of Production',
                description: 'Final challenge: Build a complete production-ready application stack.',
                storyIntro: 'The final trial awaits. Combine all your knowledge to build a production-ready application stack. You are now a Guardian of Production.',
                missionIds: [15], // Final mission
                unlockLevel: 7,
                unlockXP: 3000
            }
        ];
    }

    /**
     * Get current chapter
     */
    getCurrentChapter(): Chapter | null {
        const chapters = this.getChapters();
        return chapters.find(c => c.id === this.currentChapter) || null;
    }

    /**
     * Get chapter by ID
     */
    getChapter(id: number): Chapter | null {
        return this.getChapters().find(c => c.id === id) || null;
    }

    /**
     * Check if a chapter is unlocked
     */
    isChapterUnlocked(chapterId: number): boolean {
        const chapter = this.getChapter(chapterId);
        if (!chapter) return false;

        // First chapter is always unlocked
        if (chapterId === 1) return true;

        // Check previous chapter completion
        const prevChapter = this.getChapter(chapterId - 1);
        if (prevChapter && !this.isChapterCompleted(prevChapter.id)) {
            return false;
        }

        // Check level requirement
        if (chapter.unlockLevel && this.level < chapter.unlockLevel) {
            return false;
        }

        // Check XP requirement
        if (chapter.unlockXP && this.totalXP < chapter.unlockXP) {
            return false;
        }

        return true;
    }

    /**
     * Check if a chapter is completed
     */
    isChapterCompleted(chapterId: number): boolean {
        const chapter = this.getChapter(chapterId);
        if (!chapter) return false;

        return chapter.missionIds.every(id => this.completedMissions.has(id));
    }

    /**
     * Complete a mission
     */
    completeMission(missionId: number, xp: number): void {
        this.completedMissions.add(missionId);
        this.totalXP += xp;
        this.saveProgress();
    }

    /**
     * Update level (called from ProgressionSystem)
     */
    updateLevel(level: number): void {
        this.level = level;
        this.saveProgress();
    }

    /**
     * Get progress for current chapter
     */
    getChapterProgress(chapterId: number): { completed: number; total: number } {
        const chapter = this.getChapter(chapterId);
        if (!chapter) return { completed: 0, total: 0 };

        const completed = chapter.missionIds.filter(id => this.completedMissions.has(id)).length;
        return {
            completed,
            total: chapter.missionIds.length
        };
    }

    /**
     * Save progress to localStorage
     */
    private saveProgress(): void {
        try {
            const progress = {
                currentChapter: this.currentChapter,
                completedMissions: Array.from(this.completedMissions),
                totalXP: this.totalXP,
                level: this.level
            };
            localStorage.setItem('kubeGameCampaign', JSON.stringify(progress));
        } catch (error) {
            console.error('[CampaignManager] Failed to save progress:', error);
        }
    }

    /**
     * Load progress from localStorage
     */
    private loadProgress(): void {
        try {
            const saved = localStorage.getItem('kubeGameCampaign');
            if (saved) {
                const progress = JSON.parse(saved);
                this.currentChapter = progress.currentChapter || 1;
                this.completedMissions = new Set(progress.completedMissions || []);
                this.totalXP = progress.totalXP || 0;
                this.level = progress.level || 1;
            }
        } catch (error) {
            console.error('[CampaignManager] Failed to load progress:', error);
        }
    }

    // Getters
    getCurrentChapterId(): number { return this.currentChapter; }
    getCompletedMissions(): Set<number> { return new Set(this.completedMissions); }
    getTotalXP(): number { return this.totalXP; }
    getLevel(): number { return this.level; }
}

