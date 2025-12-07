/**
 * Certified Kubernetes Administrator (CKA) Curriculum
 * Updated for 2025 exam requirements
 */
export const ckaCurriculum = {
    id: 'cka',
    name: 'Certified Kubernetes Administrator (CKA)',
    description: 'Master Kubernetes cluster administration and management',
    modules: [
        {
            id: 1,
            title: 'Cluster Architecture, Installation & Configuration',
            weight: 25,
            description: 'Cluster setup, Helm, Kustomize, and extension interfaces (CNI, CSI, CRI)',
            xpReward: 600,
            learningObjectives: [
                'Understand cluster setup with kubeadm, kubelet, kubectl',
                'Master cluster configuration and management',
                'Learn extension interfaces: CNI (Container Network Interface)',
                'Learn extension interfaces: CSI (Container Storage Interface)',
                'Learn extension interfaces: CRI (Container Runtime Interface)',
                'Master Helm package management',
                'Master Kustomize configuration management',
                'Understand cluster upgrade procedures'
            ],
            challenges: [
                {
                    id: 'cka-1-1',
                    title: 'Explore Cluster Architecture',
                    description: 'Observe the 3D cluster visualization and understand node components',
                    command: 'kubectl get nodes',
                    xpReward: 100,
                    hints: [
                        'Use kubectl get nodes to see cluster nodes',
                        'Observe the 3D visualization of nodes'
                    ]
                },
                {
                    id: 'cka-1-2',
                    title: 'Understand Extension Interfaces',
                    description: 'Learn about CNI, CSI, and CRI interfaces',
                    command: null,
                    xpReward: 150,
                    hints: [
                        'CNI handles networking',
                        'CSI handles storage',
                        'CRI handles container runtime'
                    ]
                }
            ]
        },
        {
            id: 2,
            title: 'Workloads & Scheduling',
            weight: 15,
            description: 'Deployments, StatefulSets, DaemonSets, pod scheduling, and autoscaling',
            xpReward: 600,
            learningObjectives: [
                'Master Deployments, StatefulSets, and DaemonSets',
                'Understand pod admission and scheduling policies',
                'Learn node affinity, taints, and tolerations',
                'Master autoscaling mechanisms (HPA, VPA, Cluster Autoscaler)',
                'Understand resource limits and requests'
            ],
            challenges: [
                {
                    id: 'cka-2-1',
                    title: 'Create StatefulSet',
                    description: 'Create a StatefulSet for a database application',
                    command: 'kubectl create statefulset db --image=mysql',
                    xpReward: 150,
                    hints: [
                        'StatefulSets maintain stable network identities',
                        'Use kubectl create statefulset command'
                    ]
                },
                {
                    id: 'cka-2-2',
                    title: 'Create DaemonSet',
                    description: 'Create a DaemonSet for logging',
                    command: 'kubectl create daemonset logger --image=fluentd',
                    xpReward: 150,
                    hints: [
                        'DaemonSets run on every node',
                        'Use kubectl create daemonset command'
                    ]
                }
            ]
        },
        {
            id: 3,
            title: 'Services & Networking',
            weight: 20,
            description: 'Services, Gateway API, Ingress, Network Policies, and CoreDNS',
            xpReward: 600,
            learningObjectives: [
                'Master all service types (ClusterIP, NodePort, LoadBalancer, ExternalName)',
                'Understand Gateway API for ingress traffic management',
                'Configure Ingress controllers and routing',
                'Implement network policies',
                'Configure CoreDNS and troubleshoot DNS issues',
                'Understand service discovery and DNS'
            ],
            challenges: [
                {
                    id: 'cka-3-1',
                    title: 'Create NodePort Service',
                    description: 'Create a NodePort service to expose your application',
                    command: 'kubectl create service nodeport web --tcp=80:8080',
                    xpReward: 150,
                    hints: [
                        'NodePort exposes service on each node',
                        'Use kubectl create service nodeport'
                    ]
                },
                {
                    id: 'cka-3-2',
                    title: 'Create LoadBalancer Service',
                    description: 'Create a LoadBalancer service',
                    command: 'kubectl create service loadbalancer app --tcp=80:8080',
                    xpReward: 150,
                    hints: [
                        'LoadBalancer provides external IP',
                        'Use kubectl create service loadbalancer'
                    ]
                },
                {
                    id: 'cka-3-3',
                    title: 'Understand Gateway API',
                    description: 'Learn about Gateway API for modern ingress',
                    command: null,
                    xpReward: 100,
                    hints: [
                        'Gateway API is the next-generation ingress',
                        'It provides more features than traditional Ingress'
                    ]
                }
            ]
        },
        {
            id: 4,
            title: 'Storage',
            weight: 10,
            description: 'Dynamic volume provisioning, PVs, PVCs, StorageClasses, and snapshots',
            xpReward: 600,
            learningObjectives: [
                'Master dynamic volume provisioning',
                'Understand PersistentVolumes (PVs) and PersistentVolumeClaims (PVCs)',
                'Configure StorageClasses',
                'Understand volume types and access modes',
                'Learn volume snapshots and backups'
            ],
            challenges: [
                {
                    id: 'cka-4-1',
                    title: 'Create PersistentVolumeClaim',
                    description: 'Create a PVC for application storage',
                    command: 'kubectl create pvc my-pvc --storage=10Gi',
                    xpReward: 150,
                    hints: [
                        'PVCs request storage from the cluster',
                        'Use kubectl create pvc command'
                    ]
                },
                {
                    id: 'cka-4-2',
                    title: 'Understand Dynamic Provisioning',
                    description: 'Learn about dynamic volume provisioning',
                    command: null,
                    xpReward: 100,
                    hints: [
                        'Dynamic provisioning creates volumes automatically',
                        'StorageClasses define provisioners'
                    ]
                }
            ]
        },
        {
            id: 5,
            title: 'Troubleshooting',
            weight: 30,
            description: 'Pod issues, network problems, cluster diagnostics, and log analysis',
            xpReward: 600,
            learningObjectives: [
                'Troubleshoot pod and container issues',
                'Diagnose network service problems',
                'Perform cluster diagnostics and health checks',
                'Troubleshoot service-related issues',
                'Master log analysis and debugging techniques',
                'Optimize cluster performance'
            ],
            challenges: [
                {
                    id: 'cka-5-1',
                    title: 'Troubleshoot Failing Pod',
                    description: 'Identify and fix a pod that is not starting',
                    command: 'kubectl describe pod <pod-name>',
                    xpReward: 200,
                    hints: [
                        'Use kubectl describe to see pod details',
                        'Check events and status'
                    ]
                },
                {
                    id: 'cka-5-2',
                    title: 'Analyze Pod Logs',
                    description: 'View logs from a running pod',
                    command: 'kubectl logs <pod-name>',
                    xpReward: 150,
                    hints: [
                        'Use kubectl logs to view pod logs',
                        'Add --follow for streaming logs'
                    ]
                },
                {
                    id: 'cka-5-3',
                    title: 'Cluster Health Check',
                    description: 'Check cluster component status',
                    command: 'kubectl get componentstatuses',
                    xpReward: 150,
                    hints: [
                        'Use kubectl get componentstatuses',
                        'Check all components are healthy'
                    ]
                }
            ]
        }
    ]
};

