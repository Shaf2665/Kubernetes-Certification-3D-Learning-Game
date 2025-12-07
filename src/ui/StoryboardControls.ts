/**
 * UI Controls for Microservices Storyboard
 */
export class StoryboardControls {
    private container: HTMLElement;
    private onPlay?: () => void;
    private onPause?: () => void;
    private onNext?: () => void;
    private onPrevious?: () => void;
    private onRestart?: () => void;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        this.container = container;
        this.createControls();
    }

    private createControls(): void {
        this.container.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #9c27b0;
                border-radius: 12px;
                padding: 15px 25px;
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 1500;
            ">
                <button id="storyboard-play-pause" style="
                    background: #9c27b0;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">▶ Play</button>
                <button id="storyboard-restart" style="
                    background: rgba(156, 39, 176, 0.3);
                    color: #9c27b0;
                    border: 1px solid #9c27b0;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                ">⏮ Restart</button>
                <button id="storyboard-previous" style="
                    background: rgba(100, 100, 100, 0.5);
                    color: #ddd;
                    border: 1px solid #666;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                ">⏮ Previous</button>
                <button id="storyboard-next" style="
                    background: rgba(100, 100, 100, 0.5);
                    color: #ddd;
                    border: 1px solid #666;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Next ⏭</button>
                <div id="storyboard-progress" style="
                    color: #9c27b0;
                    font-size: 14px;
                    min-width: 100px;
                    text-align: center;
                ">Step 1 / 5</div>
            </div>
        `;

        // Setup event listeners
        const playPauseBtn = document.getElementById('storyboard-play-pause');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                const isPlaying = playPauseBtn.textContent === '⏸ Pause';
                if (isPlaying) {
                    playPauseBtn.textContent = '▶ Play';
                    if (this.onPause) this.onPause();
                } else {
                    playPauseBtn.textContent = '⏸ Pause';
                    if (this.onPlay) this.onPlay();
                }
            });
        }

        const restartBtn = document.getElementById('storyboard-restart');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                if (this.onRestart) this.onRestart();
            });
        }

        const previousBtn = document.getElementById('storyboard-previous');
        if (previousBtn) {
            previousBtn.addEventListener('click', () => {
                if (this.onPrevious) this.onPrevious();
            });
        }

        const nextBtn = document.getElementById('storyboard-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.onNext) this.onNext();
            });
        }
    }

    setOnPlay(callback: () => void): void {
        this.onPlay = callback;
    }

    setOnPause(callback: () => void): void {
        this.onPause = callback;
    }

    setOnNext(callback: () => void): void {
        this.onNext = callback;
    }

    setOnPrevious(callback: () => void): void {
        this.onPrevious = callback;
    }

    setOnRestart(callback: () => void): void {
        this.onRestart = callback;
    }

    updateProgress(current: number, total: number): void {
        const progressEl = document.getElementById('storyboard-progress');
        if (progressEl) {
            progressEl.textContent = `Step ${current} / ${total}`;
        }
    }

    setPlaying(isPlaying: boolean): void {
        const playPauseBtn = document.getElementById('storyboard-play-pause');
        if (playPauseBtn) {
            playPauseBtn.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
        }
    }
}

