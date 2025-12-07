import { Game } from './app/Game.js';

// Hide loading screen when game is ready
const loadingScreen = document.getElementById('loadingScreen');
if (loadingScreen) {
    loadingScreen.classList.add('hidden');
}

// Initialize and start the game
const game = new Game();
game.init().catch((error) => {
    console.error('Failed to initialize game:', error);
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
        loadingScreen.innerHTML = `
            <div style="color: #ff4444; text-align: center;">
                <h2>Failed to Load Game</h2>
                <p>${error.message}</p>
                <p style="margin-top: 20px; font-size: 14px; color: #888;">Please refresh the page.</p>
            </div>
        `;
    }
});

