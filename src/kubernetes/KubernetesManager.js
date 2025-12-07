import { Pod } from './Pod.js';
import { Node } from './Node.js';

/**
 * Manages Kubernetes resources in the 3D scene
 */
export class KubernetesManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.nodes = [];
        this.pods = [];
        this.deployments = new Map();
        this.services = new Map();
        this.configMaps = new Map();
        this.secrets = new Map();
        this.visualEffects = null;
        this.initCluster();
    }

    setVisualEffects(visualEffects) {
        this.visualEffects = visualEffects;
    }

    initCluster() {
        // Create initial nodes in a cluster formation
        const nodePositions = [
            { x: -5, y: 0, z: -5 },
            { x: 5, y: 0, z: -5 },
            { x: 0, y: 0, z: 5 }
        ];
        
        nodePositions.forEach((pos, i) => {
            const node = new Node(`node-${i + 1}`, pos);
            this.nodes.push(node);
            this.sceneManager.addToScene(node.container);
        });
    }

    executeCommand(command) {
        const parts = command.trim().split(/\s+/);
        if (parts.length === 0) {
            return { success: false, message: 'Empty command' };
        }

        if (parts[0] !== 'kubectl') {
            return { success: false, message: 'Error: Commands must start with "kubectl"' };
        }

        if (parts.length < 2) {
            return { success: false, message: 'Error: Invalid kubectl command' };
        }

        const action = parts[1];
        const resource = parts[2];
        const name = parts[3];

        switch (action) {
            case 'create':
                return this.handleCreate(resource, name, parts.slice(4));
            case 'get':
                return this.handleGet(resource, name);
            case 'delete':
                return this.handleDelete(resource, name);
            case 'scale':
                return this.handleScale(resource, name, parts[4]);
            case 'apply':
                return this.handleApply(parts.slice(2));
            default:
                return { success: false, message: `Unknown command: ${action}` };
        }
    }

    handleCreate(resource, name, args) {
        if (!name) {
            return { success: false, message: 'Error: Resource name required' };
        }

        if (resource === 'pod') {
            return this.createPod(name);
        } else if (resource === 'deployment') {
            return this.createDeployment(name, args);
        } else if (resource === 'service') {
            return this.createService(name, args);
        } else if (resource === 'configmap') {
            return this.createConfigMap(name);
        } else if (resource === 'secret') {
            return this.createSecret(name);
        } else {
            return { success: false, message: `Unsupported resource type: ${resource}` };
        }
    }

    createPod(name) {
        // Check if pod already exists
        if (this.pods.find(p => p.name === name)) {
            return { success: false, message: `Error: Pod "${name}" already exists` };
        }

        const node = this.getAvailableNode();
        if (!node) {
            return { success: false, message: 'Error: No available nodes' };
        }

        const pod = new Pod(name, node);
        this.pods.push(pod);
        node.addPod(pod);
        
        // Visual effect
        if (this.visualEffects) {
            const position = pod.container.position.clone();
            this.visualEffects.createCreationEffect(position);
            this.visualEffects.createPulseEffect(pod.mesh, 0x00ff00);
        }
        
        // Simulate pod starting
        setTimeout(() => {
            pod.updateStatus('Running');
        }, 1000);

        return { 
            success: true, 
            message: `Pod "${name}" created successfully`,
            resource: pod
        };
    }

    createDeployment(name, args) {
        const replicas = this.parseReplicas(args) || 1;
        this.deployments.set(name, { replicas, pods: [] });
        
        for (let i = 0; i < replicas; i++) {
            const podName = `${name}-${i}`;
            const result = this.createPod(podName);
            if (result.success) {
                this.deployments.get(name).pods.push(podName);
            }
        }
        
        return { 
            success: true, 
            message: `Deployment "${name}" created with ${replicas} replica(s)` 
        };
    }

    createService(name, args) {
        this.services.set(name, { name, type: 'ClusterIP' });
        return { 
            success: true, 
            message: `Service "${name}" created` 
        };
    }

    createConfigMap(name) {
        this.configMaps.set(name, { name });
        return { 
            success: true, 
            message: `ConfigMap "${name}" created` 
        };
    }

    createSecret(name) {
        this.secrets.set(name, { name });
        return { 
            success: true, 
            message: `Secret "${name}" created` 
        };
    }

    handleGet(resource, name) {
        if (resource === 'pods' || resource === 'pod') {
            return this.listPods();
        } else if (resource === 'nodes' || resource === 'node') {
            return this.listNodes();
        } else if (resource === 'deployments' || resource === 'deployment') {
            return this.listDeployments();
        } else if (resource === 'services' || resource === 'service') {
            return this.listServices();
        } else {
            return { success: false, message: `Unsupported resource: ${resource}` };
        }
    }

    handleDelete(resource, name) {
        if (!name) {
            return { success: false, message: 'Error: Resource name required' };
        }

        if (resource === 'pod') {
            return this.deletePod(name);
        } else if (resource === 'deployment') {
            return this.deleteDeployment(name);
        } else if (resource === 'service') {
            return this.deleteService(name);
        } else {
            return { success: false, message: `Unsupported resource: ${resource}` };
        }
    }

    handleScale(resource, name, replicas) {
        if (resource === 'deployment') {
            if (!replicas) {
                return { success: false, message: 'Error: Replicas value required' };
            }
            const replicasNum = parseInt(replicas);
            if (isNaN(replicasNum) || replicasNum < 0) {
                return { success: false, message: 'Error: Invalid replicas value' };
            }
            return this.scaleDeployment(name, replicasNum);
        } else {
            return { success: false, message: `Cannot scale resource: ${resource}` };
        }
    }

    handleApply(args) {
        // Simplified apply - would normally parse YAML
        return { success: false, message: 'kubectl apply not yet implemented' };
    }

    deletePod(name) {
        const pod = this.pods.find(p => p.name === name);
        if (pod) {
            // Visual effect before deletion
            if (this.visualEffects) {
                const position = pod.container.position.clone();
                this.visualEffects.createDeletionEffect(position);
            }
            
            pod.updateStatus('Terminating');
            setTimeout(() => {
                pod.node.removePod(pod);
                this.pods = this.pods.filter(p => p !== pod);
                pod.dispose();
            }, 500);
            return { success: true, message: `Pod "${name}" deleted` };
        }
        return { success: false, message: `Pod "${name}" not found` };
    }

    deleteDeployment(name) {
        const deployment = this.deployments.get(name);
        if (deployment) {
            deployment.pods.forEach(podName => {
                this.deletePod(podName);
            });
            this.deployments.delete(name);
            return { success: true, message: `Deployment "${name}" deleted` };
        }
        return { success: false, message: `Deployment "${name}" not found` };
    }

    deleteService(name) {
        if (this.services.has(name)) {
            this.services.delete(name);
            return { success: true, message: `Service "${name}" deleted` };
        }
        return { success: false, message: `Service "${name}" not found` };
    }

    scaleDeployment(name, targetReplicas) {
        const deployment = this.deployments.get(name);
        if (!deployment) {
            return { success: false, message: `Deployment "${name}" not found` };
        }

        const currentReplicas = deployment.pods.length;
        
        if (targetReplicas > currentReplicas) {
            // Scale up
            for (let i = currentReplicas; i < targetReplicas; i++) {
                const podName = `${name}-${i}`;
                const result = this.createPod(podName);
                if (result.success) {
                    deployment.pods.push(podName);
                }
            }
        } else if (targetReplicas < currentReplicas) {
            // Scale down
            for (let i = currentReplicas - 1; i >= targetReplicas; i--) {
                const podName = deployment.pods[i];
                this.deletePod(podName);
                deployment.pods.pop();
            }
        }
        
        return { 
            success: true, 
            message: `Deployment "${name}" scaled to ${targetReplicas} replicas` 
        };
    }

    listPods() {
        const podList = this.pods.map(pod => ({
            name: pod.name,
            status: pod.status,
            node: pod.node.name
        }));
        return { 
            success: true, 
            message: 'PODS:', 
            data: podList 
        };
    }

    listNodes() {
        const nodeList = this.nodes.map(node => ({
            name: node.name,
            pods: node.getPodCount()
        }));
        return { 
            success: true, 
            message: 'NODES:', 
            data: nodeList 
        };
    }

    listDeployments() {
        const deploymentList = Array.from(this.deployments.entries()).map(([name, dep]) => ({
            name,
            replicas: dep.pods.length
        }));
        return { 
            success: true, 
            message: 'DEPLOYMENTS:', 
            data: deploymentList 
        };
    }

    listServices() {
        const serviceList = Array.from(this.services.values()).map(svc => ({
            name: svc.name,
            type: svc.type
        }));
        return { 
            success: true, 
            message: 'SERVICES:', 
            data: serviceList 
        };
    }

    getAvailableNode() {
        if (this.nodes.length === 0) return null;
        // Simple round-robin or random selection
        return this.nodes[Math.floor(Math.random() * this.nodes.length)];
    }

    parseReplicas(args) {
        const replicasIndex = args.indexOf('--replicas');
        if (replicasIndex !== -1 && args[replicasIndex + 1]) {
            return parseInt(args[replicasIndex + 1]);
        }
        return null;
    }

    update(delta) {
        // Animate all resources
        this.nodes.forEach(node => node.animate(delta));
        this.pods.forEach(pod => pod.animate(delta));
    }

    clear() {
        this.nodes.forEach(node => node.dispose());
        this.nodes = [];
        this.pods = [];
        this.deployments.clear();
        this.services.clear();
        this.configMaps.clear();
        this.secrets.clear();
    }
}

