// YAML parsing is handled in YAMLExerciseRunner

export interface YAMLExercise {
    id: string;
    level: 1 | 2 | 3; // Beginner, Intermediate, Advanced
    title: string;
    prompt: string;
    starter: string;
    solutionValidator: (parsedYAML: any) => { valid: boolean; errors: string[] };
    hints: string[];
    xpReward: number;
    explanation?: string;
}

/**
 * YAML Exercises for Learning Journey
 */
export class YAMLExercises {
    static getExercises(): YAMLExercise[] {
        return [
            // BEGINNER LEVEL
            {
                id: 'yaml-beginner-1',
                level: 1,
                title: 'Fix Indentation',
                prompt: 'Fix the indentation errors in this YAML. All keys should be properly indented with 2 spaces.',
                starter: `apiVersion: v1
kind: Pod
metadata:
name: my-pod  # Missing indentation
spec:
  containers:
- name: nginx  # Wrong indentation
    image: nginx:latest`,
                solutionValidator: (parsed: any) => {
                    const errors: string[] = [];
                    if (!parsed.apiVersion || parsed.apiVersion !== 'v1') {
                        errors.push('apiVersion must be "v1"');
                    }
                    if (!parsed.kind || parsed.kind !== 'Pod') {
                        errors.push('kind must be "Pod"');
                    }
                    if (!parsed.metadata || !parsed.metadata.name || parsed.metadata.name !== 'my-pod') {
                        errors.push('metadata.name must be "my-pod"');
                    }
                    if (!parsed.spec || !parsed.spec.containers || !Array.isArray(parsed.spec.containers)) {
                        errors.push('spec.containers must be an array');
                    } else {
                        const container = parsed.spec.containers[0];
                        if (!container || container.name !== 'nginx' || container.image !== 'nginx:latest') {
                            errors.push('Container must have name "nginx" and image "nginx:latest"');
                        }
                    }
                    return { valid: errors.length === 0, errors };
                },
                hints: [
                    'YAML uses spaces for indentation, not tabs. Use 2 spaces per level.',
                    'The "name" under "metadata" should be indented 2 spaces from "metadata".',
                    'The "-" for array items should align with the parent key, and the item content should be indented 2 more spaces.'
                ],
                xpReward: 25,
                explanation: 'Correct! Proper indentation is crucial in YAML. Each level of nesting requires consistent spacing (typically 2 spaces).'
            },
            {
                id: 'yaml-beginner-2',
                level: 1,
                title: 'Complete Pod YAML',
                prompt: 'Complete this Pod YAML skeleton. Add a container named "web" using the "nginx:1.21" image.',
                starter: `apiVersion: v1
kind: Pod
metadata:
  name: web-pod
spec:
  containers:
  # Add your container here`,
                solutionValidator: (parsed: any) => {
                    const errors: string[] = [];
                    if (!parsed.spec || !parsed.spec.containers || !Array.isArray(parsed.spec.containers)) {
                        errors.push('spec.containers must be an array');
                    } else if (parsed.spec.containers.length === 0) {
                        errors.push('At least one container must be defined');
                    } else {
                        const container = parsed.spec.containers[0];
                        if (!container || container.name !== 'web') {
                            errors.push('Container name must be "web"');
                        }
                        if (!container || container.image !== 'nginx:1.21') {
                            errors.push('Container image must be "nginx:1.21"');
                        }
                    }
                    return { valid: errors.length === 0, errors };
                },
                hints: [
                    'Use a dash (-) to start an array item in YAML.',
                    'Each container needs a "name" and "image" field.',
                    'The container should be indented under "containers:" with the name and image as key-value pairs.'
                ],
                xpReward: 25,
                explanation: 'Perfect! You\'ve created a valid Pod YAML with a container. This is the foundation of Kubernetes deployments.'
            },
            {
                id: 'yaml-beginner-3',
                level: 1,
                title: 'Fix Key-Value Syntax',
                prompt: 'This YAML has syntax errors. Fix the key-value pairs and ensure proper formatting.',
                starter: `apiVersion v1
kind: Pod
metadata
  name: test-pod
spec
  containers:
    - name: app
      image: "myapp:latest"`,
                solutionValidator: (parsed: any) => {
                    const errors: string[] = [];
                    if (!parsed.apiVersion || parsed.apiVersion !== 'v1') {
                        errors.push('apiVersion must be "v1"');
                    }
                    if (!parsed.kind || parsed.kind !== 'Pod') {
                        errors.push('kind must be "Pod"');
                    }
                    if (!parsed.metadata || !parsed.metadata.name || parsed.metadata.name !== 'test-pod') {
                        errors.push('metadata.name must be "test-pod"');
                    }
                    if (!parsed.spec || !parsed.spec.containers) {
                        errors.push('spec.containers must exist');
                    }
                    return { valid: errors.length === 0, errors };
                },
                hints: [
                    'Key-value pairs in YAML use a colon (:) followed by a space.',
                    'Parent keys (like "metadata" and "spec") need colons and their children should be indented.',
                    'Check that "apiVersion", "metadata", and "spec" all have colons after them.'
                ],
                xpReward: 25,
                explanation: 'Excellent! All key-value pairs are now correctly formatted with colons and proper indentation.'
            },

            // INTERMEDIATE LEVEL
            {
                id: 'yaml-intermediate-1',
                level: 2,
                title: 'Create Deployment YAML',
                prompt: 'Create a Deployment YAML with 3 replicas. Use apiVersion "apps/v1", name it "my-deployment", and set the container image to "nginx:latest".',
                starter: `# Create a complete Deployment YAML here`,
                solutionValidator: (parsed: any) => {
                    const errors: string[] = [];
                    if (!parsed.apiVersion || parsed.apiVersion !== 'apps/v1') {
                        errors.push('apiVersion must be "apps/v1" for Deployments');
                    }
                    if (!parsed.kind || parsed.kind !== 'Deployment') {
                        errors.push('kind must be "Deployment"');
                    }
                    if (!parsed.metadata || !parsed.metadata.name || parsed.metadata.name !== 'my-deployment') {
                        errors.push('metadata.name must be "my-deployment"');
                    }
                    if (!parsed.spec || parsed.spec.replicas !== 3) {
                        errors.push('spec.replicas must be 3');
                    }
                    if (!parsed.spec || !parsed.spec.template || !parsed.spec.template.spec || !parsed.spec.template.spec.containers) {
                        errors.push('spec.template.spec.containers must exist');
                    } else {
                        const container = parsed.spec.template.spec.containers[0];
                        if (!container || container.image !== 'nginx:latest') {
                            errors.push('Container image must be "nginx:latest"');
                        }
                    }
                    return { valid: errors.length === 0, errors };
                },
                hints: [
                    'Deployments use apiVersion "apps/v1" and kind "Deployment".',
                    'The spec.replicas field sets the desired number of pod replicas.',
                    'Containers are defined under spec.template.spec.containers (note the nested structure).'
                ],
                xpReward: 50,
                explanation: 'Great! You\'ve created a Deployment that will manage 3 replicas of your nginx pods automatically.'
            },
            {
                id: 'yaml-intermediate-2',
                level: 2,
                title: 'Add Resource Limits',
                prompt: 'Add resource requests and limits to this Deployment. Set CPU request: 100m, CPU limit: 200m, memory request: 128Mi, memory limit: 256Mi.',
                starter: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: resource-deployment
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: app
        image: nginx:latest
        # Add resources here`,
                solutionValidator: (parsed: any) => {
                    const errors: string[] = [];
                    const container = parsed?.spec?.template?.spec?.containers?.[0];
                    if (!container) {
                        errors.push('Container not found');
                    } else {
                        if (!container.resources) {
                            errors.push('resources field is missing');
                        } else {
                            if (!container.resources.requests || container.resources.requests.cpu !== '100m') {
                                errors.push('CPU request must be "100m"');
                            }
                            if (!container.resources.requests || container.resources.requests.memory !== '128Mi') {
                                errors.push('Memory request must be "128Mi"');
                            }
                            if (!container.resources.limits || container.resources.limits.cpu !== '200m') {
                                errors.push('CPU limit must be "200m"');
                            }
                            if (!container.resources.limits || container.resources.limits.memory !== '256Mi') {
                                errors.push('Memory limit must be "256Mi"');
                            }
                        }
                    }
                    return { valid: errors.length === 0, errors };
                },
                hints: [
                    'Resources are defined under each container as "resources: requests: ... limits: ...".',
                    'CPU values use "m" for millicores (100m = 0.1 CPU).',
                    'Memory values use "Mi" for mebibytes or "Gi" for gibibytes.'
                ],
                xpReward: 50,
                explanation: 'Perfect! Resource limits help Kubernetes schedule pods efficiently and prevent resource starvation.'
            },
            {
                id: 'yaml-intermediate-3',
                level: 2,
                title: 'Add Labels and Selectors',
                prompt: 'Add a label "app: webapp" to the Deployment metadata and match it in spec.selector.matchLabels.',
                starter: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: labeled-deployment
spec:
  replicas: 1
  template:
    metadata:
      # Add labels here
    spec:
      containers:
      - name: app
        image: nginx:latest
  # Add selector here`,
                solutionValidator: (parsed: any) => {
                    const errors: string[] = [];
                    if (!parsed.spec || !parsed.spec.selector || !parsed.spec.selector.matchLabels) {
                        errors.push('spec.selector.matchLabels must exist');
                    } else if (parsed.spec.selector.matchLabels.app !== 'webapp') {
                        errors.push('selector.matchLabels.app must be "webapp"');
                    }
                    if (!parsed.spec || !parsed.spec.template || !parsed.spec.template.metadata || !parsed.spec.template.metadata.labels) {
                        errors.push('spec.template.metadata.labels must exist');
                    } else if (parsed.spec.template.metadata.labels.app !== 'webapp') {
                        errors.push('template.metadata.labels.app must be "webapp"');
                    }
                    return { valid: errors.length === 0, errors };
                },
                hints: [
                    'Labels are key-value pairs defined under metadata.labels.',
                    'The selector.matchLabels must match the labels on the pod template.',
                    'Both the pod template labels and selector should have "app: webapp".'
                ],
                xpReward: 50,
                explanation: 'Excellent! Labels and selectors are how Kubernetes connects Deployments to their Pods.'
            },

            // ADVANCED LEVEL
            {
                id: 'yaml-advanced-1',
                level: 3,
                title: 'Multi-Resource YAML',
                prompt: 'Create a Deployment and Service in the same YAML file. Use "---" to separate resources. Deployment: name "api", 2 replicas, image "myapp:1.0". Service: name "api-service", type ClusterIP, port 80.',
                starter: `# Create Deployment and Service here
# Separate them with "---"`,
                solutionValidator: (parsed: any) => {
                    // For multi-document YAML, parsed might be an array
                    const docs = Array.isArray(parsed) ? parsed : [parsed];
                    const deployment = docs.find((d: any) => d.kind === 'Deployment');
                    const service = docs.find((d: any) => d.kind === 'Service');

                    const errors: string[] = [];
                    
                    if (!deployment) {
                        errors.push('Deployment resource not found');
                    } else {
                        if (deployment.metadata?.name !== 'api') {
                            errors.push('Deployment name must be "api"');
                        }
                        if (deployment.spec?.replicas !== 2) {
                            errors.push('Deployment replicas must be 2');
                        }
                        const container = deployment.spec?.template?.spec?.containers?.[0];
                        if (!container || container.image !== 'myapp:1.0') {
                            errors.push('Deployment container image must be "myapp:1.0"');
                        }
                    }

                    if (!service) {
                        errors.push('Service resource not found');
                    } else {
                        if (service.metadata?.name !== 'api-service') {
                            errors.push('Service name must be "api-service"');
                        }
                        if (service.spec?.type !== 'ClusterIP') {
                            errors.push('Service type must be "ClusterIP"');
                        }
                        if (!service.spec?.ports || service.spec.ports[0]?.port !== 80) {
                            errors.push('Service port must be 80');
                        }
                    }

                    return { valid: errors.length === 0, errors };
                },
                hints: [
                    'Use "---" to separate multiple YAML documents in one file.',
                    'Each resource (Deployment, Service) should be a separate document.',
                    'The Service should use a selector that matches the Deployment\'s pod labels.'
                ],
                xpReward: 75,
                explanation: 'Outstanding! You\'ve created a complete application stack with both Deployment and Service in a single YAML file.'
            },
            {
                id: 'yaml-advanced-2',
                level: 3,
                title: 'Deployment + Service + ConfigMap',
                prompt: 'Create three resources: Deployment "app" (image "nginx"), Service "app-service" (ClusterIP, port 80), and ConfigMap "app-config" with data key "ENV" = "production".',
                starter: `# Create Deployment, Service, and ConfigMap
# Use "---" to separate resources`,
                solutionValidator: (parsed: any) => {
                    const docs = Array.isArray(parsed) ? parsed : [parsed];
                    const deployment = docs.find((d: any) => d.kind === 'Deployment');
                    const service = docs.find((d: any) => d.kind === 'Service');
                    const configMap = docs.find((d: any) => d.kind === 'ConfigMap');

                    const errors: string[] = [];
                    
                    if (!deployment || deployment.metadata?.name !== 'app') {
                        errors.push('Deployment named "app" not found');
                    } else {
                        const container = deployment.spec?.template?.spec?.containers?.[0];
                        if (!container || container.image !== 'nginx') {
                            errors.push('Deployment container image must be "nginx"');
                        }
                    }

                    if (!service || service.metadata?.name !== 'app-service') {
                        errors.push('Service named "app-service" not found');
                    } else {
                        if (service.spec?.type !== 'ClusterIP') {
                            errors.push('Service type must be "ClusterIP"');
                        }
                        if (!service.spec?.ports || service.spec.ports[0]?.port !== 80) {
                            errors.push('Service port must be 80');
                        }
                    }

                    if (!configMap || configMap.metadata?.name !== 'app-config') {
                        errors.push('ConfigMap named "app-config" not found');
                    } else {
                        if (!configMap.data || configMap.data.ENV !== 'production') {
                            errors.push('ConfigMap must have data.ENV = "production"');
                        }
                    }

                    return { valid: errors.length === 0, errors };
                },
                hints: [
                    'ConfigMaps store configuration data under the "data" field as key-value pairs.',
                    'All three resources should be in the same file, separated by "---".',
                    'Make sure each resource has the correct apiVersion (v1 for Service/ConfigMap, apps/v1 for Deployment).'
                ],
                xpReward: 75,
                explanation: 'Fantastic! You\'ve created a complete microservice configuration with Deployment, Service, and ConfigMap working together.'
            },
            {
                id: 'yaml-advanced-3',
                level: 3,
                title: 'Find and Fix Errors',
                prompt: 'This YAML has multiple errors. Find and fix: wrong apiVersion, missing required fields, incorrect indentation, and invalid values.',
                starter: `apiVersion: v1
kind: Deployment
metadata:
name: broken-deploy
spec:
replicas: "three"  # Should be a number
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: app
        image: nginx
        ports:
        - containerPort: "eighty"  # Should be a number
resources:
  requests:
    cpu: 100m`,
                solutionValidator: (parsed: any) => {
                    const errors: string[] = [];
                    
                    if (!parsed.apiVersion || parsed.apiVersion !== 'apps/v1') {
                        errors.push('Deployment must use apiVersion "apps/v1", not "v1"');
                    }
                    if (!parsed.metadata || !parsed.metadata.name || parsed.metadata.name !== 'broken-deploy') {
                        errors.push('metadata.name must be properly indented and set to "broken-deploy"');
                    }
                    if (typeof parsed.spec?.replicas !== 'number' || parsed.spec.replicas !== 3) {
                        errors.push('spec.replicas must be a number (3), not a string');
                    }
                    const container = parsed.spec?.template?.spec?.containers?.[0];
                    if (!container) {
                        errors.push('Container definition is missing or malformed');
                    } else {
                        if (typeof container.ports?.[0]?.containerPort !== 'number' || container.ports[0].containerPort !== 80) {
                            errors.push('containerPort must be a number (80), not a string');
                        }
                        if (!container.resources || !container.resources.requests || container.resources.requests.cpu !== '100m') {
                            errors.push('resources.requests.cpu must be properly indented under the container');
                        }
                    }
                    return { valid: errors.length === 0, errors };
                },
                hints: [
                    'Deployments require apiVersion "apps/v1", not "v1".',
                    'Numeric values like replicas and containerPort should not be quoted.',
                    'Check indentation - resources should be under the container, not at the root level.'
                ],
                xpReward: 75,
                explanation: 'Excellent debugging! You\'ve identified and fixed all the YAML errors including type mismatches and indentation issues.'
            }
        ];
    }

    static getExerciseById(id: string): YAMLExercise | undefined {
        return this.getExercises().find(ex => ex.id === id);
    }

    static getExercisesByLevel(level: 1 | 2 | 3): YAMLExercise[] {
        return this.getExercises().filter(ex => ex.level === level);
    }
}

