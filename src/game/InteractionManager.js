import * as THREE from 'three';

/**
 * Manages interactions with 3D objects (click, hover, tooltips)
 */
export class InteractionManager {
    constructor(camera, scene, renderer, k8sManager) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.k8sManager = k8sManager;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredObject = null;
        this.selectedObject = null;
        this.tooltip = null;
        this.infoPanel = null;
        
        this.init();
    }

    init() {
        // Create tooltip element
        this.createTooltip();
        this.createInfoPanel();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.id = 'object-tooltip';
        this.tooltip.className = 'object-tooltip hidden';
        document.getElementById('game-screen').appendChild(this.tooltip);
    }

    createInfoPanel() {
        this.infoPanel = document.createElement('div');
        this.infoPanel.id = 'resource-info-panel';
        this.infoPanel.className = 'resource-info-panel hidden';
        document.getElementById('game-screen').appendChild(this.infoPanel);
    }

    setupEventListeners() {
        const canvas = this.renderer.domElement;
        
        // Mouse move for hover
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Click for selection
        canvas.addEventListener('click', (e) => this.onMouseClick(e));
        
        // Mouse leave to hide tooltip
        canvas.addEventListener('mouseleave', () => this.hideTooltip());
    }

    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Find intersected objects
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            const resource = this.findResourceFromObject(object);
            
            if (resource) {
                if (this.hoveredObject !== resource) {
                    this.onHoverStart(resource, object);
                }
                this.updateTooltip(event, resource);
            } else {
                this.onHoverEnd();
            }
        } else {
            this.onHoverEnd();
        }
    }

    onMouseClick(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            const resource = this.findResourceFromObject(object);
            
            if (resource) {
                this.selectResource(resource);
            }
        } else {
            this.deselectResource();
        }
    }

    findResourceFromObject(object) {
        // Traverse up the object hierarchy to find the container
        let current = object;
        while (current) {
            if (current.name && current.name.startsWith('pod-')) {
                const podName = current.name.replace('pod-', '');
                return this.k8sManager.pods.find(p => p.name === podName);
            } else if (current.name && current.name.startsWith('node-')) {
                const nodeName = current.name.replace('node-', '');
                return this.k8sManager.nodes.find(n => n.name === nodeName);
            }
            current = current.parent;
        }
        return null;
    }

    onHoverStart(resource, object) {
        this.onHoverEnd(); // Clear previous hover
        
        this.hoveredObject = resource;
        
        // Add hover effect - traverse to find mesh
        const container = resource.container || resource.mesh;
        if (container) {
            container.traverse((child) => {
                if (child.material && child.type === 'Mesh') {
                    // Store original values
                    if (!child.material.userData.originalEmissive) {
                        child.material.userData.originalEmissive = child.material.emissiveIntensity;
                    }
                    child.material.emissiveIntensity = 0.5;
                    if (child.scale) {
                        child.userData.originalScale = child.scale.clone();
                        child.scale.multiplyScalar(1.1);
                    }
                }
            });
        }
    }

    onHoverEnd() {
        if (this.hoveredObject) {
            // Remove hover effect
            const container = this.hoveredObject.container || this.hoveredObject.mesh;
            if (container) {
                container.traverse((child) => {
                    if (child.material && child.type === 'Mesh') {
                        child.material.emissiveIntensity = child.material.userData.originalEmissive || 0.2;
                        if (child.scale && child.userData.originalScale) {
                            child.scale.copy(child.userData.originalScale);
                        }
                    }
                });
            }
            this.hoveredObject = null;
        }
        this.hideTooltip();
    }

    updateTooltip(event, resource) {
        if (!this.tooltip) return;
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        this.tooltip.style.left = `${x + 10}px`;
        this.tooltip.style.top = `${y + 10}px`;
        
        // Get resource info
        let info = '';
        if (resource.name) {
            info = `<strong>${resource.name}</strong><br>`;
        }
        if (resource.status) {
            info += `Status: ${resource.status}`;
        } else if (resource.pods) {
            info += `Pods: ${resource.pods.length}`;
        }
        
        this.tooltip.innerHTML = info;
        this.tooltip.classList.remove('hidden');
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.add('hidden');
        }
    }

    selectResource(resource) {
        // Deselect previous
        this.deselectResource();
        
        this.selectedObject = resource;
        
        // Add selection effect
        const container = resource.container || resource.mesh;
        if (container) {
            container.traverse((child) => {
                if (child.material && child.type === 'Mesh') {
                    // Store original values
                    if (!child.material.userData.originalEmissive) {
                        child.material.userData.originalEmissive = child.material.emissiveIntensity;
                    }
                    if (!child.material.userData.originalColor) {
                        child.material.userData.originalColor = child.material.emissive.getHex();
                    }
                    child.material.emissiveIntensity = 0.8;
                    child.material.emissive.setHex(0xffff00);
                }
            });
        }
        
        // Show info panel
        this.showInfoPanel(resource);
    }

    deselectResource() {
        if (this.selectedObject) {
            const container = this.selectedObject.container || this.selectedObject.mesh;
            if (container) {
                container.traverse((child) => {
                    if (child.material && child.type === 'Mesh') {
                        child.material.emissiveIntensity = child.material.userData.originalEmissive || 0.2;
                        child.material.emissive.setHex(child.material.userData.originalColor || 0x4a90e2);
                    }
                });
            }
            this.selectedObject = null;
        }
        this.hideInfoPanel();
    }

    showInfoPanel(resource) {
        if (!this.infoPanel) return;
        
        let html = `<div class="resource-info-header">
            <h3>${resource.name || 'Resource'}</h3>
            <button class="close-info-btn" onclick="this.closest('.resource-info-panel').classList.add('hidden')">×</button>
        </div>`;
        
        html += `<div class="resource-info-content">`;
        
        if (resource.status) {
            html += `<div class="info-item"><span class="info-label">Status:</span> <span class="info-value status-${resource.status.toLowerCase()}">${resource.status}</span></div>`;
        }
        
        if (resource.node) {
            html += `<div class="info-item"><span class="info-label">Node:</span> <span class="info-value">${resource.node.name}</span></div>`;
        }
        
        if (resource.pods) {
            html += `<div class="info-item"><span class="info-label">Pods:</span> <span class="info-value">${resource.pods.length}</span></div>`;
            if (resource.pods.length > 0) {
                html += `<div class="info-item"><span class="info-label">Pod List:</span><ul class="pod-list">`;
                resource.pods.forEach(pod => {
                    html += `<li>${pod.name} (${pod.status})</li>`;
                });
                html += `</ul></div>`;
            }
        }
        
        html += `</div>`;
        
        this.infoPanel.innerHTML = html;
        this.infoPanel.classList.remove('hidden');
    }

    hideInfoPanel() {
        if (this.infoPanel) {
            this.infoPanel.classList.add('hidden');
        }
    }

    update() {
        // Update tooltip position if visible
        // This is called from the game loop
    }
}

