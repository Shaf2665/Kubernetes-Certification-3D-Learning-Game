/**
 * Certified Kubernetes Application Developer (CKAD) Curriculum
 * Updated for 2025 exam requirements
 */
export const ckadCurriculum = {
    id: 'ckad',
    name: 'Certified Kubernetes Application Developer (CKAD)',
    description: 'Master building and deploying applications on Kubernetes',
    modules: [
        {
            id: 1,
            title: 'Application Design and Build',
            weight: 20,
            description: 'Pod design, multi-container pods, init containers, and container images',
            xpReward: 600,
            learningObjectives: [
                'Master pod design and configuration',
                'Understand multi-container pods and sidecar patterns',
                'Learn init containers and lifecycle hooks',
                'Understand container images and image pull policies',
                'Master resource specifications'
            ],
            challenges: [
                {
                    id: 'ckad-1-1',
                    title: 'Create Multi-Container Pod',
                    description: 'Create a pod with multiple containers',
                    command: 'kubectl create pod multi-app --containers=app,sidecar',
                    xpReward: 150,
                    hints: [
                        'Multi-container pods share network and storage',
                        'Use --containers flag to specify multiple containers'
                    ]
                },
                {
                    id: 'ckad-1-2',
                    title: 'Configure Init Containers',
                    description: 'Create a pod with init containers',
                    command: null,
                    xpReward: 150,
                    hints: [
                        'Init containers run before main containers',
                        'They are useful for setup tasks'
                    ]
                }
            ]
        },
        {
            id: 2,
            title: 'Application Deployment',
            weight: 20,
            description: 'Deployment strategies, rolling updates, rollbacks, and health checks',
            xpReward: 600,
            learningObjectives: [
                'Master deployment strategies (rolling, blue-green, canary)',
                'Understand rolling updates and rollbacks',
                'Configure health checks (liveness, readiness, startup probes)',
                'Master application lifecycle management',
                'Configure deployment scaling'
            ],
            challenges: [
                {
                    id: 'ckad-2-1',
                    title: 'Create Deployment with Health Checks',
                    description: 'Create a deployment with liveness and readiness probes',
                    command: 'kubectl create deployment app --image=nginx',
                    xpReward: 150,
                    hints: [
                        'Health checks ensure application availability',
                        'Liveness probes restart unhealthy containers',
                        'Readiness probes control traffic routing'
                    ]
                },
                {
                    id: 'ckad-2-2',
                    title: 'Perform Rolling Update',
                    description: 'Update a deployment with zero downtime',
                    command: 'kubectl set image deployment/app nginx=nginx:1.21',
                    xpReward: 150,
                    hints: [
                        'Rolling updates replace pods gradually',
                        'Use kubectl set image to update'
                    ]
                },
                {
                    id: 'ckad-2-3',
                    title: 'Rollback Deployment',
                    description: 'Rollback a deployment to previous version',
                    command: 'kubectl rollout undo deployment/app',
                    xpReward: 100,
                    hints: [
                        'Use kubectl rollout undo',
                        'Check rollout history with kubectl rollout history'
                    ]
                }
            ]
        },
        {
            id: 3,
            title: 'Observability and Maintenance',
            weight: 15,
            description: 'Liveness/Readiness probes, logging, monitoring, and debugging',
            xpReward: 600,
            learningObjectives: [
                'Master liveness and readiness probes',
                'Understand application logging and log aggregation',
                'Learn resource monitoring and metrics',
                'Master application debugging techniques',
                'Understand performance monitoring'
            ],
            challenges: [
                {
                    id: 'ckad-3-1',
                    title: 'View Application Logs',
                    description: 'View logs from a deployment',
                    command: 'kubectl logs deployment/app',
                    xpReward: 100,
                    hints: [
                        'Use kubectl logs to view application logs',
                        'Add -f for following logs'
                    ]
                },
                {
                    id: 'ckad-3-2',
                    title: 'Configure Resource Monitoring',
                    description: 'Monitor resource usage of pods',
                    command: 'kubectl top pods',
                    xpReward: 150,
                    hints: [
                        'Use kubectl top to see resource usage',
                        'Requires metrics-server installed'
                    ]
                }
            ]
        },
        {
            id: 4,
            title: 'Environment, Configuration, and Security',
            weight: 25,
            description: 'ConfigMaps, Secrets, Pod Security Standards, RBAC, and network policies',
            xpReward: 600,
            learningObjectives: [
                'Master ConfigMaps and environment variables',
                'Understand secrets management',
                'Learn security contexts and Pod Security Standards (PSS)',
                'Master service accounts and RBAC',
                'Understand access control and permissions',
                'Implement network policies for application security'
            ],
            challenges: [
                {
                    id: 'ckad-4-1',
                    title: 'Create ConfigMap',
                    description: 'Create a ConfigMap for application configuration',
                    command: 'kubectl create configmap app-config --from-literal=key=value',
                    xpReward: 100,
                    hints: [
                        'ConfigMaps store configuration data',
                        'Use --from-literal for key-value pairs'
                    ]
                },
                {
                    id: 'ckad-4-2',
                    title: 'Create Secret',
                    description: 'Create a secret for sensitive data',
                    command: 'kubectl create secret generic app-secret --from-literal=password=secret123',
                    xpReward: 100,
                    hints: [
                        'Secrets store sensitive data',
                        'Data is base64 encoded'
                    ]
                },
                {
                    id: 'ckad-4-3',
                    title: 'Understand Pod Security Standards',
                    description: 'Learn about PSS for pod security',
                    command: null,
                    xpReward: 150,
                    hints: [
                        'PSS defines security policies',
                        'Three levels: privileged, baseline, restricted'
                    ]
                },
                {
                    id: 'ckad-4-4',
                    title: 'Configure RBAC',
                    description: 'Create a service account and role',
                    command: 'kubectl create serviceaccount app-sa',
                    xpReward: 150,
                    hints: [
                        'RBAC controls access to resources',
                        'Service accounts represent applications'
                    ]
                }
            ]
        },
        {
            id: 5,
            title: 'Services and Networking',
            weight: 20,
            description: 'Service types, network policies, ingress, and persistent storage',
            xpReward: 600,
            learningObjectives: [
                'Master all service types and definitions',
                'Understand service discovery and DNS',
                'Implement network policies configuration',
                'Configure ingress and routing',
                'Troubleshoot service connectivity',
                'Use persistent storage for applications (PVs/PVCs)'
            ],
            challenges: [
                {
                    id: 'ckad-5-1',
                    title: 'Create ClusterIP Service',
                    description: 'Create a ClusterIP service for internal access',
                    command: 'kubectl create service clusterip app --tcp=80:8080',
                    xpReward: 100,
                    hints: [
                        'ClusterIP is the default service type',
                        'Only accessible within cluster'
                    ]
                },
                {
                    id: 'ckad-5-2',
                    title: 'Create Network Policy',
                    description: 'Create a network policy to control traffic',
                    command: null,
                    xpReward: 150,
                    hints: [
                        'Network policies control pod-to-pod communication',
                        'Define ingress and egress rules'
                    ]
                },
                {
                    id: 'ckad-5-3',
                    title: 'Use Persistent Storage',
                    description: 'Mount a PVC in a pod',
                    command: null,
                    xpReward: 150,
                    hints: [
                        'PVCs provide persistent storage',
                        'Mount in pod spec volumes section'
                    ]
                }
            ]
        }
    ]
};

