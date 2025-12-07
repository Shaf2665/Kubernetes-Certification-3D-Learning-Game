import { ClusterSimulator } from '../kubernetes/ClusterSimulator.js';

/**
 * Terminal UI for kubectl command simulation
 */
export class TerminalUI {
    private clusterSimulator: ClusterSimulator;
    private terminalElement: HTMLElement | null = null;
    private inputElement: HTMLInputElement | null = null;
    private outputElement: HTMLElement | null = null;
    private commandHistory: string[] = [];
    private historyIndex: number = -1;

    constructor(clusterSimulator: ClusterSimulator) {
        this.clusterSimulator = clusterSimulator;
    }

    async init(): Promise<void> {
        this.createTerminal();
        this.setupEventListeners();
    }

    private createTerminal(): void {
        const terminal = document.getElementById('terminal');
        if (!terminal) {
            console.warn('[TerminalUI] Terminal element not found. Make sure UIManager creates it first.');
            return;
        }

        // Clear any existing content and event listeners
        terminal.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <div style="background: #1a1a2e; padding: 10px; border-bottom: 1px solid #4a90e2; display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #4a90e2; font-weight: bold;">kubectl Terminal</span>
                    <button id="terminal-close" style="
                        background: transparent;
                        border: 1px solid #4a90e2;
                        color: #4a90e2;
                        padding: 4px 8px;
                        border-radius: 3px;
                        cursor: pointer;
                    ">×</button>
                </div>
                <div id="terminal-output" style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    font-family: 'Courier New', monospace;
                    font-size: 13px;
                    color: #00ff00;
                    background: #000;
                "></div>
                <div style="display: flex; padding: 10px; background: #1a1a2e; border-top: 1px solid #4a90e2;">
                    <span style="color: #4a90e2; margin-right: 8px;">$</span>
                    <input 
                        id="terminal-input" 
                        type="text" 
                        autocomplete="off"
                        style="
                            flex: 1;
                            background: transparent;
                            border: none;
                            color: #00ff00;
                            font-family: 'Courier New', monospace;
                            font-size: 13px;
                            outline: none;
                        "
                        placeholder="kubectl ..."
                    />
                </div>
            </div>
        `;

        this.terminalElement = terminal;
        this.inputElement = document.getElementById('terminal-input') as HTMLInputElement;
        this.outputElement = document.getElementById('terminal-output');

        const closeBtn = document.getElementById('terminal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (this.terminalElement) {
                    this.terminalElement.style.display = 'none';
                }
            });
        }

        this.addOutput('Kubernetes Cluster Simulator Terminal');
        this.addOutput('Type kubectl commands to interact with the cluster.');
        this.addOutput('');
    }

    private setupEventListeners(): void {
        if (!this.inputElement) return;

        this.inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(this.inputElement!.value);
                this.inputElement!.value = '';
                this.historyIndex = -1;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.commandHistory.length > 0) {
                    if (this.historyIndex === -1) {
                        this.historyIndex = this.commandHistory.length - 1;
                    } else if (this.historyIndex > 0) {
                        this.historyIndex--;
                    }
                    this.inputElement!.value = this.commandHistory[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    this.inputElement!.value = this.commandHistory[this.historyIndex];
                } else {
                    this.historyIndex = -1;
                    this.inputElement!.value = '';
                }
            }
        });
    }

    private executeCommand(command: string): void {
        if (!command.trim()) return;

        this.addOutput(`$ ${command}`);
        this.commandHistory.push(command);

        const parts = command.trim().split(/\s+/);
        const cmd = parts[0];
        const action = parts[1];
        const resourceType = parts[2];
        const resourceName = parts[3];

        try {
            if (cmd === 'kubectl') {
                this.handleKubectlCommand(action, resourceType, resourceName, parts.slice(4));
            } else {
                this.addOutput(`Command not found: ${cmd}`);
            }
        } catch (error: any) {
            this.addOutput(`Error: ${error.message}`, 'error');
        }

        this.addOutput('');
    }

    private handleKubectlCommand(action: string, resourceType: string, resourceName: string, args: string[]): void {
        switch (action) {
            case 'create':
                this.handleCreate(resourceType, resourceName, args);
                break;
            case 'delete':
                this.handleDelete(resourceType, resourceName);
                break;
            case 'get':
                this.handleGet(resourceType, resourceName);
                break;
            case 'scale':
                this.handleScale(resourceType, resourceName, args);
                break;
            default:
                this.addOutput(`Unknown action: ${action}`);
        }
    }

    private handleCreate(resourceType: string, resourceName: string, args: string[]): void {
        switch (resourceType) {
            case 'pod':
                const pod = this.clusterSimulator.createPod(resourceName);
                if (pod) {
                    this.addOutput(`pod/${resourceName} created`, 'success');
                } else {
                    this.addOutput(`Error: pod "${resourceName}" already exists`, 'error');
                }
                break;
            case 'deployment':
                const replicas = this.extractReplicas(args) || 1;
                const deployment = this.clusterSimulator.createDeployment(resourceName, 'nginx', replicas);
                if (deployment) {
                    this.addOutput(`deployment.apps/${resourceName} created`, 'success');
                } else {
                    this.addOutput(`Error: deployment "${resourceName}" already exists`, 'error');
                }
                break;
            case 'service':
                const serviceType = this.extractType(args) || 'ClusterIP';
                const service = this.clusterSimulator.createService(resourceName, serviceType as any);
                if (service) {
                    this.addOutput(`service/${resourceName} created`, 'success');
                } else {
                    this.addOutput(`Error: service "${resourceName}" already exists`, 'error');
                }
                break;
            case 'configmap':
                const configMap = this.clusterSimulator.createConfigMap(resourceName);
                if (configMap) {
                    this.addOutput(`configmap/${resourceName} created`, 'success');
                } else {
                    this.addOutput(`Error: configmap "${resourceName}" already exists`, 'error');
                }
                break;
            case 'secret':
                const secret = this.clusterSimulator.createSecret(resourceName);
                if (secret) {
                    this.addOutput(`secret/${resourceName} created`, 'success');
                } else {
                    this.addOutput(`Error: secret "${resourceName}" already exists`, 'error');
                }
                break;
            default:
                this.addOutput(`Unknown resource type: ${resourceType}`);
        }
    }

    private handleDelete(resourceType: string, resourceName: string): void {
        switch (resourceType) {
            case 'pod':
                const deleted = this.clusterSimulator.deletePod(resourceName);
                if (deleted) {
                    this.addOutput(`pod "${resourceName}" deleted`, 'success');
                } else {
                    this.addOutput(`Error: pod "${resourceName}" not found`, 'error');
                }
                break;
            default:
                this.addOutput(`Deletion of ${resourceType} not yet implemented`);
        }
    }

    private handleGet(resourceType: string, resourceName?: string): void {
        const resources = this.clusterSimulator.getAllResources();
        const filtered = resourceName 
            ? resources.filter(r => r.name === resourceName && r.type === resourceType)
            : resources.filter(r => r.type === resourceType);

        if (filtered.length === 0) {
            this.addOutput(`No resources found`);
            return;
        }

        this.addOutput(`NAME${' '.repeat(30)}TYPE`);
        this.addOutput('-'.repeat(50));
        filtered.forEach(resource => {
            this.addOutput(`${resource.name}${' '.repeat(30 - resource.name.length)}${resource.type}`);
        });
    }

    private handleScale(resourceType: string, resourceName: string, args: string[]): void {
        if (resourceType === 'deployment') {
            const replicas = parseInt(args[0] || '1');
            const scaled = this.clusterSimulator.scaleDeployment(resourceName, replicas);
            if (scaled) {
                this.addOutput(`deployment.apps/${resourceName} scaled to ${replicas}`, 'success');
            } else {
                this.addOutput(`Error: deployment "${resourceName}" not found`, 'error');
            }
        }
    }

    private extractReplicas(args: string[]): number | null {
        const replicasIndex = args.indexOf('--replicas');
        if (replicasIndex >= 0 && replicasIndex < args.length - 1) {
            return parseInt(args[replicasIndex + 1]);
        }
        return null;
    }

    private extractType(args: string[]): string | null {
        const typeIndex = args.indexOf('--type');
        if (typeIndex >= 0 && typeIndex < args.length - 1) {
            return args[typeIndex + 1];
        }
        return null;
    }

    private addOutput(text: string, type: 'normal' | 'success' | 'error' = 'normal'): void {
        if (!this.outputElement) return;

        const line = document.createElement('div');
        line.style.marginBottom = '2px';
        
        switch (type) {
            case 'success':
                line.style.color = '#00ff00';
                break;
            case 'error':
                line.style.color = '#ff4444';
                break;
            default:
                line.style.color = '#00ff00';
        }
        
        line.textContent = text;
        this.outputElement.appendChild(line);
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }

    show(): void {
        if (this.terminalElement) {
            this.terminalElement.style.display = 'block';
            if (this.inputElement) {
                this.inputElement.focus();
            }
        }
    }

    hide(): void {
        if (this.terminalElement) {
            this.terminalElement.style.display = 'none';
        }
    }
}

