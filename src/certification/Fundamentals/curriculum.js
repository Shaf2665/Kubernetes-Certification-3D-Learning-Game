/**
 * Kubernetes Fundamentals (KCNA) Curriculum
 * Updated for 2025 exam requirements
 */
export const fundamentalsCurriculum = {
    id: 'fundamentals',
    name: 'Kubernetes Fundamentals',
    description: 'Master the basics of Kubernetes and cloud-native technologies',
    modules: [
        {
            id: 1,
            title: 'Kubernetes Fundamentals',
            weight: 46,
            description: 'Introduction to Kubernetes, basic concepts, and kubectl basics',
            xpReward: 500,
            learningObjectives: [
                'Understand what Kubernetes is and its purpose',
                'Learn basic concepts: Pods, Nodes, Clusters, Namespaces',
                'Master Kubernetes API primitives and resource types',
                'Learn kubectl command structure and basics',
                'Understand YAML manifests and resource definitions',
                'Learn about API versions and resource schemas'
            ],
            challenges: [
                {
                    id: 'fund-1-1',
                    title: 'Create Your First Pod',
                    description: 'Create a pod named "my-first-pod"',
                    command: 'kubectl create pod my-first-pod',
                    xpReward: 100,
                    hints: [
                        'Use kubectl create pod <name>',
                        'Make sure to use the correct command syntax'
                    ]
                },
                {
                    id: 'fund-1-2',
                    title: 'List Pods',
                    description: 'List all pods in the cluster',
                    command: 'kubectl get pods',
                    xpReward: 50,
                    hints: [
                        'Use kubectl get pods to see all pods'
                    ]
                },
                {
                    id: 'fund-1-3',
                    title: 'List Nodes',
                    description: 'List all nodes in the cluster',
                    command: 'kubectl get nodes',
                    xpReward: 50,
                    hints: [
                        'Use kubectl get nodes to see all nodes'
                    ]
                }
            ]
        },
        {
            id: 2,
            title: 'Kubernetes Architecture',
            weight: 22,
            description: 'Control plane components, node components, and cluster architecture',
            xpReward: 500,
            learningObjectives: [
                'Understand control plane components (API server, etcd, scheduler, controller manager)',
                'Learn about node components (kubelet, kube-proxy, container runtime)',
                'Visualize cluster architecture in 3D',
                'Understand API server and etcd basics',
                'Learn component interactions and communication',
                'Understand high availability concepts'
            ],
            challenges: [
                {
                    id: 'fund-2-1',
                    title: 'Explore Cluster Architecture',
                    description: 'Observe the 3D cluster visualization',
                    command: null,
                    xpReward: 100,
                    hints: []
                }
            ]
        },
        {
            id: 3,
            title: 'Container Orchestration',
            weight: 16,
            description: 'Deployments, ReplicaSets, Pod lifecycle, and scaling',
            xpReward: 500,
            learningObjectives: [
                'Understand Deployments and ReplicaSets',
                'Learn Pod lifecycle and states (Pending, Running, Succeeded, Failed)',
                'Master container orchestration concepts',
                'Learn replication and scaling basics',
                'Understand pod scheduling fundamentals',
                'Learn resource requests and limits'
            ],
            challenges: [
                {
                    id: 'fund-3-1',
                    title: 'Create a Deployment',
                    description: 'Create a deployment named "web-app" with 3 replicas',
                    command: 'kubectl create deployment web-app --replicas 3',
                    xpReward: 150,
                    hints: [
                        'Use kubectl create deployment <name> --replicas <number>'
                    ]
                },
                {
                    id: 'fund-3-2',
                    title: 'Scale Deployment',
                    description: 'Scale the web-app deployment to 5 replicas',
                    command: 'kubectl scale deployment web-app --replicas 5',
                    xpReward: 100,
                    hints: [
                        'Use kubectl scale deployment <name> --replicas <number>'
                    ]
                }
            ]
        },
        {
            id: 4,
            title: 'Cloud Native Architecture',
            weight: 8,
            description: 'Microservices, service discovery, and cloud-native principles',
            xpReward: 500,
            learningObjectives: [
                'Understand microservices concepts and patterns',
                'Learn service discovery mechanisms',
                'Master cloud-native design principles',
                'Understand containerization basics',
                'Learn application delivery patterns',
                'Understand CI/CD pipeline basics'
            ],
            challenges: [
                {
                    id: 'fund-4-1',
                    title: 'Create a Service',
                    description: 'Create a service named "web-service"',
                    command: 'kubectl create service web-service',
                    xpReward: 100,
                    hints: [
                        'Use kubectl create service <name>'
                    ]
                }
            ]
        },
        {
            id: 5,
            title: 'Cloud Native Observability',
            weight: 8,
            description: 'Logs, monitoring, debugging, and health checks',
            xpReward: 500,
            learningObjectives: [
                'Learn logs and monitoring basics',
                'Master basic debugging techniques',
                'Understand health checks (liveness, readiness)',
                'Learn observability tools overview',
                'Understand application monitoring fundamentals',
                'Learn log aggregation concepts'
            ],
            challenges: [
                {
                    id: 'fund-5-1',
                    title: 'Inspect Pod Status',
                    description: 'Get detailed information about a pod',
                    command: 'kubectl get pod <pod-name>',
                    xpReward: 100,
                    hints: [
                        'Use kubectl get pod <name> to see pod details'
                    ]
                }
            ]
        }
    ]
};

