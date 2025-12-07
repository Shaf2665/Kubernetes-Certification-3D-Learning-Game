import { KubernetesManager } from '../kubernetes/KubernetesManager.js';

/**
 * Terminal interface for kubectl commands
 */
export class CommandTerminal {
    constructor(sceneManager, gameSystem) {
        this.sceneManager = sceneManager;
        this.gameSystem = gameSystem;
        this.k8sManager = new KubernetesManager(sceneManager);
        this.commandHistory = [];
        this.historyIndex = -1;
        this.challengeUI = null; // Will be set by main.js
        this.init();
    }

    setChallengeUI(challengeUI) {
        this.challengeUI = challengeUI;
    }

    init() {
        this.setupEventListeners();
        this.printWelcome();
    }

    setupEventListeners() {
        const terminalInput = document.getElementById('terminal-input');
        if (!terminalInput) return;

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleCommand(terminalInput.value);
                terminalInput.value = '';
                this.historyIndex = -1;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.commandHistory.length > 0) {
                    this.historyIndex = Math.max(0, this.historyIndex - 1);
                    terminalInput.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex >= 0) {
                    this.historyIndex = Math.min(this.commandHistory.length - 1, this.historyIndex + 1);
                    terminalInput.value = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex] || '';
                }
            }
        });

        // Focus terminal input when terminal is opened
        document.getElementById('terminal-panel')?.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    printWelcome() {
        this.log('Welcome to Kubernetes Terminal!', 'info');
        this.log('Type kubectl commands to interact with your cluster.', 'info');
        this.log('Example: kubectl create pod my-pod', 'info');
        this.log('');
    }

    handleCommand(command) {
        const trimmedCommand = command.trim();
        if (!trimmedCommand) return;

        // Add to history
        this.commandHistory.push(trimmedCommand);
        if (this.commandHistory.length > 50) {
            this.commandHistory.shift();
        }

        // Display command
        this.log(`$ ${trimmedCommand}`, 'command');

        // Execute command
        const result = this.k8sManager.executeCommand(trimmedCommand);

        if (result.success) {
            this.log(result.message, 'success');
            
            // Visual feedback for successful commands
            this.showSuccessFeedback();
            
            // Check task completion immediately after successful command
            if (this.challengeUI) {
                setTimeout(() => {
                    this.challengeUI.checkTaskCompletion(trimmedCommand, result);
                }, 50);
            }
            
            // If there's data, display it
            if (result.data) {
                if (Array.isArray(result.data)) {
                    result.data.forEach(item => {
                        const itemStr = Object.entries(item)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ');
                        this.log(`  ${itemStr}`, 'data');
                    });
                }
            }
        } else {
            this.log(result.message, 'error');
            this.showErrorFeedback();
        }

        this.log(''); // Empty line for spacing
    }

    log(message, type = 'info') {
        const terminalOutput = document.getElementById('terminal-output');
        const line = document.createElement('div');
        line.className = `terminal-line terminal-${type}`;
        line.textContent = message;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    clear() {
        const terminalOutput = document.getElementById('terminal-output');
        terminalOutput.innerHTML = '';
        this.printWelcome();
    }

    getKubernetesManager() {
        return this.k8sManager;
    }

    showSuccessFeedback() {
        const terminal = document.getElementById('terminal-panel');
        if (terminal) {
            terminal.classList.add('command-success');
            setTimeout(() => {
                terminal.classList.remove('command-success');
            }, 300);
        }
    }

    showErrorFeedback() {
        const terminal = document.getElementById('terminal-panel');
        if (terminal) {
            terminal.classList.add('command-error');
            setTimeout(() => {
                terminal.classList.remove('command-error');
            }, 300);
        }
    }
}

