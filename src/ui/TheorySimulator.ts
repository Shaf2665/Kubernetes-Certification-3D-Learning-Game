import { TheoryClusterSimulator, TheoryDeployment, TheoryReplicaSet, TheoryPod } from '../simulators/TheoryClusterSimulator.js';

/**
 * UI Component for Theory Cluster Simulator
 */
export class TheorySimulator {
    private container: HTMLElement;
    private simulator: TheoryClusterSimulator;
    private logContainer: HTMLElement | null = null;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        this.container = container;
        this.simulator = new TheoryClusterSimulator();
        this.createUI();
        this.setupSimulator();
    }

    private createUI(): void {
        this.container.innerHTML = `
            <div style="
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #4caf50;
                border-radius: 12px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                height: 100%;
            ">
                <h2 style="color: #4caf50; margin: 0 0 15px 0; font-size: 24px;">Theory Simulator</h2>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button id="theory-create-pod" style="
                        background: rgba(74, 144, 226, 0.3);
                        color: #4a90e2;
                        border: 1px solid #4a90e2;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Create Pod</button>
                    
                    <button id="theory-create-deployment" style="
                        background: rgba(76, 175, 80, 0.3);
                        color: #4caf50;
                        border: 1px solid #4caf50;
                        padding: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Create Deployment</button>
                    
                    <div style="display: flex; gap: 5px;">
                        <input type="text" id="theory-scale-name" placeholder="Deployment name" style="
                            flex: 1;
                            background: rgba(0, 0, 0, 0.5);
                            color: #ddd;
                            border: 1px solid #666;
                            padding: 8px;
                            border-radius: 5px;
                        ">
                        <input type="number" id="theory-scale-replicas" placeholder="Replicas" min="1" style="
                            width: 80px;
                            background: rgba(0, 0, 0, 0.5);
                            color: #ddd;
                            border: 1px solid #666;
                            padding: 8px;
                            border-radius: 5px;
                        ">
                        <button id="theory-scale" style="
                            background: rgba(255, 193, 7, 0.3);
                            color: #ffc107;
                            border: 1px solid #ffc107;
                            padding: 8px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                        ">Scale</button>
                    </div>
                    
                    <div style="display: flex; gap: 5px;">
                        <input type="text" id="theory-update-name" placeholder="Deployment name" style="
                            flex: 1;
                            background: rgba(0, 0, 0, 0.5);
                            color: #ddd;
                            border: 1px solid #666;
                            padding: 8px;
                            border-radius: 5px;
                        ">
                        <input type="text" id="theory-update-image" placeholder="Image:tag" style="
                            flex: 1;
                            background: rgba(0, 0, 0, 0.5);
                            color: #ddd;
                            border: 1px solid #666;
                            padding: 8px;
                            border-radius: 5px;
                        ">
                        <button id="theory-update" style="
                            background: rgba(156, 39, 176, 0.3);
                            color: #9c27b0;
                            border: 1px solid #9c27b0;
                            padding: 8px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                        ">Update Image</button>
                    </div>
                    
                    <div style="display: flex; gap: 5px;">
                        <input type="text" id="theory-rollback-name" placeholder="Deployment name" style="
                            flex: 1;
                            background: rgba(0, 0, 0, 0.5);
                            color: #ddd;
                            border: 1px solid #666;
                            padding: 8px;
                            border-radius: 5px;
                        ">
                        <button id="theory-rollback" style="
                            background: rgba(244, 67, 54, 0.3);
                            color: #f44336;
                            border: 1px solid #f44336;
                            padding: 8px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                        ">Rollback</button>
                    </div>
                    
                    <label style="display: flex; align-items: center; gap: 10px; color: #ddd; cursor: pointer;">
                        <input type="checkbox" id="theory-pause-rollout" style="cursor: pointer;">
                        <span>Pause Rollout</span>
                    </label>
                </div>

                <div id="theory-state" style="
                    flex: 1;
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid #4caf50;
                    border-radius: 5px;
                    padding: 15px;
                    overflow-y: auto;
                    min-height: 200px;
                ">
                    <h3 style="color: #4caf50; margin: 0 0 10px 0; font-size: 16px;">Current State</h3>
                    <div id="theory-state-content" style="color: #aaa; font-size: 13px; font-family: monospace;">
                        No resources created yet.
                    </div>
                </div>

                <div id="theory-log" style="
                    max-height: 150px;
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid #666;
                    border-radius: 5px;
                    padding: 10px;
                    overflow-y: auto;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    color: #00ff00;
                ">
                    <div style="color: #888; margin-bottom: 5px;">Event Log:</div>
                    <div id="theory-log-content"></div>
                </div>
            </div>
        `;

        this.logContainer = document.getElementById('theory-log-content');
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Create Pod
        const createPodBtn = document.getElementById('theory-create-pod');
        if (createPodBtn) {
            createPodBtn.addEventListener('click', () => {
                const name = prompt('Enter Pod name:', 'my-pod');
                const image = prompt('Enter container image:', 'nginx:latest');
                if (name && image) {
                    this.simulator.createPod(name, image);
                }
            });
        }

        // Create Deployment
        const createDeployBtn = document.getElementById('theory-create-deployment');
        if (createDeployBtn) {
            createDeployBtn.addEventListener('click', () => {
                const name = prompt('Enter Deployment name:', 'my-deployment');
                const replicasStr = prompt('Enter number of replicas:', '3');
                const image = prompt('Enter container image:', 'nginx:latest');
                if (name && replicasStr && image) {
                    const replicas = parseInt(replicasStr, 10);
                    if (!isNaN(replicas) && replicas > 0) {
                        this.simulator.createDeployment(name, replicas, image);
                    }
                }
            });
        }

        // Scale Deployment
        const scaleBtn = document.getElementById('theory-scale');
        if (scaleBtn) {
            scaleBtn.addEventListener('click', () => {
                const name = (document.getElementById('theory-scale-name') as HTMLInputElement)?.value;
                const replicasStr = (document.getElementById('theory-scale-replicas') as HTMLInputElement)?.value;
                if (name && replicasStr) {
                    const replicas = parseInt(replicasStr, 10);
                    if (!isNaN(replicas) && replicas > 0) {
                        this.simulator.scaleDeployment(name, replicas);
                    }
                }
            });
        }

        // Update Image
        const updateBtn = document.getElementById('theory-update');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                const name = (document.getElementById('theory-update-name') as HTMLInputElement)?.value;
                const image = (document.getElementById('theory-update-image') as HTMLInputElement)?.value;
                if (name && image) {
                    this.simulator.updateDeploymentImage(name, image);
                }
            });
        }

        // Rollback
        const rollbackBtn = document.getElementById('theory-rollback');
        if (rollbackBtn) {
            rollbackBtn.addEventListener('click', () => {
                const name = (document.getElementById('theory-rollback-name') as HTMLInputElement)?.value;
                if (name) {
                    this.simulator.rollbackDeployment(name);
                }
            });
        }

        // Pause Rollout
        const pauseCheckbox = document.getElementById('theory-pause-rollout') as HTMLInputElement;
        if (pauseCheckbox) {
            pauseCheckbox.addEventListener('change', () => {
                this.simulator.setPauseRollout(pauseCheckbox.checked);
            });
        }
    }

    private setupSimulator(): void {
        // Setup state change callback
        this.simulator.setOnStateChange((state) => {
            this.updateStateDisplay(state);
        });

        // Setup log callback
        this.simulator.setOnLog((message) => {
            if (this.logContainer) {
                const logEntry = document.createElement('div');
                logEntry.textContent = message;
                logEntry.style.marginBottom = '5px';
                this.logContainer.appendChild(logEntry);
                this.logContainer.scrollTop = this.logContainer.scrollHeight;
            }
        });
    }

    private updateStateDisplay(state: { pods: TheoryPod[]; deployments: TheoryDeployment[]; replicaSets: TheoryReplicaSet[] }): void {
        const stateContent = document.getElementById('theory-state-content');
        if (!stateContent) return;

        let html = '';

        // Deployments
        if (state.deployments.length > 0) {
            html += '<div style="margin-bottom: 15px;"><strong style="color: #4caf50;">Deployments:</strong><br>';
            state.deployments.forEach(deploy => {
                html += `<div style="margin: 5px 0; padding: 8px; background: rgba(76, 175, 80, 0.1); border-radius: 3px;">
                    <strong>${deploy.name}</strong><br>
                    Replicas: ${deploy.replicas} | Image: ${deploy.image}
                </div>`;
            });
            html += '</div>';
        }

        // ReplicaSets
        if (state.replicaSets.length > 0) {
            html += '<div style="margin-bottom: 15px;"><strong style="color: #ffc107;">ReplicaSets:</strong><br>';
            state.replicaSets.forEach(rs => {
                html += `<div style="margin: 5px 0; padding: 8px; background: rgba(255, 193, 7, 0.1); border-radius: 3px;">
                    <strong>${rs.name}</strong><br>
                    Desired: ${rs.desired} | Current: ${rs.current}
                </div>`;
            });
            html += '</div>';
        }

        // Pods
        if (state.pods.length > 0) {
            html += '<div><strong style="color: #4a90e2;">Pods:</strong><br>';
            state.pods.forEach(pod => {
                html += `<div style="margin: 5px 0; padding: 8px; background: rgba(74, 144, 226, 0.1); border-radius: 3px;">
                    <strong>${pod.name}</strong><br>
                    Image: ${pod.image} | Status: ${pod.status}
                </div>`;
            });
            html += '</div>';
        }

        if (!html) {
            html = '<div style="color: #888;">No resources created yet.</div>';
        }

        stateContent.innerHTML = html;
    }

    dispose(): void {
        this.simulator.dispose();
    }
}

