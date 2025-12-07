/**
 * UI Controller for Architecture Timeline animations
 */
export class AnimationController {
    private container: HTMLElement;
    private onPlay?: () => void;
    private onPause?: () => void;
    private onStepForward?: () => void;
    private onStepBack?: () => void;
    private onSpeedChange?: (speed: number) => void;

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
                border: 2px solid #4a90e2;
                border-radius: 12px;
                padding: 15px 25px;
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 1500;
            ">
                <button id="anim-play-pause" style="
                    background: #4a90e2;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">▶ Play</button>
                <button id="anim-step-back" style="
                    background: rgba(100, 100, 100, 0.5);
                    color: #ddd;
                    border: 1px solid #666;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                ">⏮</button>
                <button id="anim-step-forward" style="
                    background: rgba(100, 100, 100, 0.5);
                    color: #ddd;
                    border: 1px solid #666;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                ">⏭</button>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #ddd; font-size: 14px;">Speed:</span>
                    <input type="range" id="anim-speed" min="0.5" max="2" step="0.5" value="1" style="width: 100px;">
                    <span id="anim-speed-value" style="color: #4a90e2; font-size: 14px; min-width: 40px;">1x</span>
                </div>
                <div id="anim-narration" style="
                    max-width: 400px;
                    padding: 10px 15px;
                    background: rgba(74, 144, 226, 0.1);
                    border: 1px solid #4a90e2;
                    border-radius: 5px;
                    color: #ddd;
                    font-size: 14px;
                    line-height: 1.4;
                ">Ready to play animation</div>
            </div>
        `;

        // Setup event listeners
        const playPauseBtn = document.getElementById('anim-play-pause');
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

        const stepBackBtn = document.getElementById('anim-step-back');
        if (stepBackBtn) {
            stepBackBtn.addEventListener('click', () => {
                if (this.onStepBack) this.onStepBack();
            });
        }

        const stepForwardBtn = document.getElementById('anim-step-forward');
        if (stepForwardBtn) {
            stepForwardBtn.addEventListener('click', () => {
                if (this.onStepForward) this.onStepForward();
            });
        }

        const speedSlider = document.getElementById('anim-speed') as HTMLInputElement;
        const speedValue = document.getElementById('anim-speed-value');
        if (speedSlider && speedValue) {
            speedSlider.addEventListener('input', () => {
                const speed = parseFloat(speedSlider.value);
                speedValue.textContent = `${speed}x`;
                if (this.onSpeedChange) this.onSpeedChange(speed);
            });
        }
    }

    setOnPlay(callback: () => void): void {
        this.onPlay = callback;
    }

    setOnPause(callback: () => void): void {
        this.onPause = callback;
    }

    setOnStepForward(callback: () => void): void {
        this.onStepForward = callback;
    }

    setOnStepBack(callback: () => void): void {
        this.onStepBack = callback;
    }

    setOnSpeedChange(callback: (speed: number) => void): void {
        this.onSpeedChange = callback;
    }

    updateNarration(text: string): void {
        const narrationEl = document.getElementById('anim-narration');
        if (narrationEl) {
            narrationEl.textContent = text;
        }
    }

    setPlaying(isPlaying: boolean): void {
        const playPauseBtn = document.getElementById('anim-play-pause');
        if (playPauseBtn) {
            playPauseBtn.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
        }
    }
}

