import { Mission } from './MissionsManager.js';

/**
 * Defines all 15 Kubernetes Fundamentals missions with sequential, logical progression
 */
export class FundamentalsMissions {
    static getMissions(): Mission[] {
        console.log('[FundamentalsMissions] Getting missions...');
        const missions: Mission[] = [
            {
                id: 1,
                title: 'Create Your First Pod',
                description: 'Pods are the smallest deployable units in Kubernetes.',
                explanation: 'A Pod wraps one or more containers and includes networking and storage context. Pods are the fundamental building blocks of Kubernetes applications. Each Pod gets its own IP address and can contain one or more containers that share storage and network resources.',
                whyThisMatters: 'Everything in Kubernetes runs inside Pods. They are the building blocks of the entire system. Understanding Pods is essential because all other Kubernetes resources (Deployments, Services, etc.) ultimately manage Pods.',
                storyIntro: 'In the quiet void of the cluster, your journey begins. The first spark of life must be awakened—a Pod, the smallest unit of existence in the Kubernetes realm.',
                chapter: 1,
                xp: 50,
                objectives: [
                    'Understand what a Pod is',
                    'Create a Pod using kubectl',
                    'See the Pod appear in the 3D cluster'
                ],
                hint: 'Try: kubectl create pod mypod --image=nginx',
                exampleCommand: 'kubectl create pod mypod --image=nginx',
                completed: false,
                xpReward: 100,
                checkCompletion: (eventType: string, _data: any) => {
                    return eventType === 'podCreated';
                }
            },
            {
                id: 2,
                title: 'Create Your First Deployment',
                description: 'Now that you\'ve created a Pod, it\'s time to learn how Kubernetes manages multiple replicas of an application.',
                explanation: 'Deployments are higher-level abstractions that manage Pods through ReplicaSets. When you create a Deployment, Kubernetes automatically creates a ReplicaSet, which then creates and manages Pods. Deployments provide declarative updates, rolling updates, and self-healing capabilities.',
                whyThisMatters: 'Deployments are the recommended way to manage Pods in production. They provide self-healing, rolling updates, and stable app management. Understanding Deployments is crucial for managing real-world applications.',
                storyIntro: 'As your Pods multiply, order must be established. Deployments rise to bring structure and resilience to your growing cluster.',
                chapter: 1,
                xp: 75,
                prerequisites: {
                    requiresPod: true
                },
                objectives: [
                    'Create a Deployment using kubectl',
                    'Observe how Kubernetes automatically creates Pods'
                ],
                hint: 'kubectl create deployment mydeploy --image=nginx',
                exampleCommand: 'kubectl create deployment mydeploy --image=nginx',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, _data: any) => {
                    return eventType === 'deploymentCreated';
                }
            },
            {
                id: 3,
                title: 'Scale a Deployment',
                description: 'Learn how to scale your Deployment to handle more traffic and ensure high availability.',
                explanation: 'Deployments use ReplicaSets to maintain Pod count automatically. When you scale a Deployment, Kubernetes creates or removes Pods to match your desired state. This provides high availability and load distribution across your application.',
                whyThisMatters: 'Scaling is a fundamental operation for maintaining application availability. In production, you need multiple replicas to handle traffic and survive failures. Understanding how to scale Deployments is essential.',
                storyIntro: 'With your Deployment established, you must now learn to scale it, multiplying your Pods to meet the demands of your application.',
                chapter: 1,
                xp: 75,
                prerequisites: {
                    requiresDeployment: true
                },
                objectives: [
                    'Scale a Deployment to 3 or more replicas',
                    'Observe how Kubernetes maintains the desired state'
                ],
                hint: 'Try: kubectl scale deployment mydeploy --replicas=3',
                exampleCommand: 'kubectl scale deployment mydeploy --replicas=3',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, data: any) => {
                    return eventType === 'deploymentScaled' && data && typeof data.newReplicas === 'number' && !isNaN(data.newReplicas) && data.newReplicas >= 3;
                }
            },
            {
                id: 4,
                title: 'Expose a Deployment using a Service',
                description: 'Services expose Pods to stable networking inside or outside the cluster.',
                explanation: 'Pods have ephemeral IPs; Services provide stable access. Since Pods can be created and destroyed, their IP addresses change. Services provide a stable endpoint that routes traffic to the correct Pods using labels and selectors. This is essential for microservices communication.',
                whyThisMatters: 'Without Services, Pods cannot reliably communicate. Services are essential for microservices architectures where different components need to find and talk to each other. They abstract away Pod lifecycle and provide consistent networking.',
                storyIntro: 'In the network battlefield, Services emerge as the guardians of connectivity. They ensure your applications can communicate and be discovered.',
                chapter: 2,
                xp: 75,
                prerequisites: {
                    requiresDeployment: true
                },
                objectives: [
                    'Create a Service to expose your Deployment',
                    'Understand ClusterIP behavior',
                    'See how Services route traffic to Pods'
                ],
                hint: 'Try: kubectl expose deployment mydeploy --port=80 --target-port=80',
                exampleCommand: 'kubectl expose deployment mydeploy --port=80 --target-port=80',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, _data: any) => {
                    return eventType === 'serviceCreated';
                }
            },
            {
                id: 5,
                title: 'Understand and Observe ReplicaSets',
                description: 'ReplicaSets ensure the correct number of Pod replicas are running.',
                explanation: 'Deployments create ReplicaSets as controllers. ReplicaSets use label selectors to identify which Pods they manage. If a Pod is deleted or fails, the ReplicaSet automatically creates a new one to maintain the desired count. Understanding this relationship is key to understanding Kubernetes.',
                whyThisMatters: 'Understanding the Pod → ReplicaSet → Deployment chain is foundational. This hierarchy is crucial for understanding how Kubernetes maintains desired state. When troubleshooting, you need to understand how these components interact.',
                storyIntro: 'Behind every Deployment lies a ReplicaSet, the silent guardian ensuring your Pods never fall below the desired count.',
                chapter: 2,
                xp: 75,
                prerequisites: {
                    requiresDeployment: true
                },
                objectives: [
                    'Inspect ReplicaSets created by your Deployment',
                    'Delete a Pod and watch it regenerate',
                    'Understand the relationship between Deployment, ReplicaSet, and Pods'
                ],
                hint: 'kubectl get rs',
                exampleCommand: 'kubectl get rs',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, _data: any) => {
                    // Check if ReplicaSet was created (happens automatically with Deployment)
                    return eventType === 'replicaSetCreated' || eventType === 'deploymentCreated';
                }
            },
            {
                id: 6,
                title: 'Create and Use a ConfigMap',
                description: 'ConfigMaps store non-sensitive configuration data.',
                explanation: 'They allow injecting environment variables or config files. ConfigMaps decouple configuration from container images, making applications more portable. You can create them from literal values, files, or directories, and mount them into Pods.',
                whyThisMatters: 'Separates config from container images, a Kubernetes best practice. This allows you to use the same container image across different environments (dev, staging, prod) by just changing the ConfigMap. It\'s a fundamental pattern in cloud-native applications.',
                storyIntro: 'The cluster holds secrets and configurations. Master these, and you will have the power to adapt your applications to any environment.',
                chapter: 2,
                xp: 75,
                objectives: [
                    'Create a ConfigMap',
                    'Mount it or use env variables in a Pod'
                ],
                hint: 'kubectl create configmap app-config --from-literal=MODE=dev',
                exampleCommand: 'kubectl create configmap app-config --from-literal=MODE=dev',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, _data: any) => {
                    return eventType === 'configMapCreated';
                }
            },
            {
                id: 7,
                title: 'Create and Use a Secret',
                description: 'Secrets store sensitive information like passwords.',
                explanation: 'They are base64-encoded objects used securely within Pods. Secrets are similar to ConfigMaps but designed for sensitive data. While not encrypted by default, they should never be committed to version control and can be encrypted at rest in production clusters.',
                whyThisMatters: 'Security is essential; Secrets prevent hardcoding credentials. In real-world applications, you need to store database passwords, API keys, and certificates securely. Using Secrets is the proper way to handle sensitive data in Kubernetes.',
                storyIntro: 'Some knowledge must remain hidden. Secrets guard the most sensitive information, protecting your applications from prying eyes.',
                chapter: 2,
                xp: 75,
                objectives: [
                    'Create a Secret',
                    'Use it in a Pod'
                ],
                hint: 'kubectl create secret generic db-pass --from-literal=password=123',
                exampleCommand: 'kubectl create secret generic db-pass --from-literal=password=123',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, _data: any) => {
                    return eventType === 'secretCreated';
                }
            },
            {
                id: 8,
                title: 'Create a Namespace and Deploy Objects Into It',
                description: 'Namespaces isolate resources within a cluster.',
                explanation: 'Useful for teams, environments, or permissions. Namespaces act like virtual clusters within a physical cluster. Each namespace has its own set of resources and can have different access controls. Common namespaces include default, kube-system, and kube-public.',
                whyThisMatters: 'Organizing workloads prevents naming conflicts and improves security. In multi-tenant environments, namespaces are essential for separating different teams or projects. They also help organize resources and implement RBAC policies.',
                storyIntro: 'The cluster is vast. Namespaces create boundaries, organizing the chaos into manageable domains of control.',
                chapter: 3,
                xp: 75,
                objectives: [
                    'Create a namespace',
                    'Deploy resources into it'
                ],
                hint: 'kubectl create namespace dev',
                exampleCommand: 'kubectl create namespace dev',
                completed: false,
                xpReward: 150,
                checkCompletion: (_eventType: string, _data: any) => {
                    // Would need namespace creation event
                    return false; // Placeholder - needs implementation
                }
            },
            {
                id: 9,
                title: 'Apply Resource Requests & Limits',
                description: 'Requests and limits control how Pods use CPU and memory.',
                explanation: 'They help the scheduler place Pods correctly. Resource requests specify the minimum resources a Pod needs. The scheduler uses these to place Pods on nodes with available capacity. Limits prevent a Pod from consuming too many resources.',
                whyThisMatters: 'Prevents resource starvation and improves cluster stability. Without resource management, one Pod could consume all CPU or memory on a node, affecting other Pods. This is critical for multi-tenant clusters and production environments.',
                storyIntro: 'Resources are finite. Master the art of requests and limits, and you will ensure fair distribution across your cluster.',
                chapter: 3,
                xp: 100,
                objectives: [
                    'Apply a Pod spec with requests/limits'
                ],
                hint: 'Use a YAML file with resources.limits and resources.requests',
                exampleCommand: 'kubectl create pod mypod --image=nginx --requests=cpu=100m,memory=128Mi --limits=cpu=200m,memory=256Mi',
                completed: false,
                xpReward: 200,
                checkCompletion: (_eventType: string, _data: any) => {
                    // Would need to check if pod has resource limits
                    return false; // Placeholder - needs implementation
                }
            },
            {
                id: 10,
                title: 'Configure Liveness & Readiness Probes',
                description: 'Probes allow Kubernetes to detect unhealthy or unready containers.',
                explanation: 'Liveness restarts containers; readiness controls traffic. Liveness probes determine if a container is running. If it fails, Kubernetes restarts the container. Readiness probes determine if a container is ready to accept traffic. If it fails, the Pod is removed from Service endpoints.',
                whyThisMatters: 'Critical for production-grade reliability. Properly configured probes ensure your application recovers from failures automatically and doesn\'t receive traffic before it\'s ready. This is essential for zero-downtime deployments.',
                storyIntro: 'Health checks are the pulse of your cluster. Probes watch over your Pods, ensuring they are alive and ready to serve.',
                chapter: 3,
                xp: 100,
                objectives: [
                    'Create a Pod with probes'
                ],
                hint: 'livenessProbe: httpGet: path: /',
                exampleCommand: 'kubectl create pod mypod --image=nginx --liveness-probe=http-get=http://:80/health',
                completed: false,
                xpReward: 200,
                checkCompletion: (_eventType: string, _data: any) => {
                    // Would need to check if pod has probes configured
                    return false; // Placeholder - needs implementation
                }
            },
            {
                id: 11,
                title: 'Attach a Volume (PVC)',
                description: 'Volumes store persistent data for Pods.',
                explanation: 'PVCs bind to PVs for dynamic storage. PersistentVolumeClaims (PVCs) are requests for storage that get bound to PersistentVolumes (PVs). StorageClasses define different storage types and enable dynamic provisioning. Data in volumes persists even when Pods are deleted.',
                whyThisMatters: 'Stateful workloads rely on persistent storage. Databases, file storage, and stateful applications need data to survive Pod restarts. Understanding volumes is essential for deploying stateful applications in Kubernetes.',
                storyIntro: 'Beyond ephemeral containers lies the storage frontier. Here, data persists, volumes bind, and stateful applications find their home.',
                chapter: 4,
                xp: 100,
                objectives: [
                    'Create PVC',
                    'Attach it to a Pod'
                ],
                hint: 'kubectl apply -f pvc.yaml',
                exampleCommand: 'kubectl create pvc mypvc --storage-class=standard --size=1Gi',
                completed: false,
                xpReward: 200,
                checkCompletion: (_eventType: string, _data: any) => {
                    // Would need PVC creation event
                    return false; // Placeholder - needs implementation
                }
            },
            {
                id: 12,
                title: 'Use Node Affinity',
                description: 'Affinity lets you choose which nodes Pods prefer or require.',
                explanation: 'Useful for performance, compliance, or hardware constraints. Node affinity allows you to constrain which nodes your Pod can be scheduled on. There are two types: required (hard requirement) and preferred (soft preference). This gives fine-grained control over Pod placement.',
                whyThisMatters: 'Gives fine control over Pod scheduling. You might need Pods on nodes with specific hardware (GPUs, SSDs), for compliance reasons, or to co-locate Pods for performance. Understanding affinity is important for advanced cluster management.',
                storyIntro: 'The Scheduler holds the power to place Pods wisely. Master its trials, and you will control the very placement of your workloads.',
                chapter: 4,
                xp: 100,
                objectives: [
                    'Create Pod with affinity rules'
                ],
                hint: 'nodeAffinity: requiredDuringScheduling...',
                exampleCommand: 'kubectl create pod mypod --image=nginx --node-selector=disktype=ssd',
                completed: false,
                xpReward: 200,
                checkCompletion: (_eventType: string, _data: any) => {
                    // Would need to check if pod has affinity rules
                    return false; // Placeholder - needs implementation
                }
            },
            {
                id: 13,
                title: 'Inspect Cluster Events',
                description: 'Events provide insight into what the cluster is doing.',
                explanation: 'They help diagnose scheduling issues and warnings. Kubernetes Events provide a record of what has happened in your cluster. They show when resources are created, updated, deleted, or when errors occur. Events help you understand the lifecycle of resources and diagnose problems.',
                whyThisMatters: 'Understanding events is key to debugging. When something goes wrong, events are often the first place to look. They provide detailed information about what Kubernetes is doing and why operations succeed or fail.',
                storyIntro: 'Every action leaves a trace. Events are the chronicles of your cluster, revealing the hidden stories of what transpires within.',
                chapter: 4,
                xp: 75,
                objectives: [
                    'Trigger events',
                    'Inspect them'
                ],
                hint: 'kubectl get events',
                exampleCommand: 'kubectl get events --sort-by=.metadata.creationTimestamp',
                completed: false,
                xpReward: 150,
                checkCompletion: (_eventType: string, _data: any) => {
                    // Would need event viewing action
                    return false; // Placeholder - needs implementation
                }
            },
            {
                id: 14,
                title: 'Fix a CrashLoopBackOff',
                description: 'Some Pods crash repeatedly due to configuration or runtime errors.',
                explanation: 'CrashLoopBackOff indicates repeated failure; debugging is key. This happens when a container starts, crashes, and Kubernetes keeps trying to restart it. Common causes include application errors, missing environment variables, incorrect image configuration, or resource constraints.',
                whyThisMatters: 'Understanding Pod failures is critical to troubleshooting real clusters. In production, you\'ll encounter failing Pods regularly. Knowing how to diagnose and fix them quickly is essential for maintaining system reliability.',
                storyIntro: 'Not all Pods awaken peacefully. Some stumble and fall, caught in an endless cycle of failure. Your task: break the loop and restore order.',
                chapter: 4,
                xp: 100,
                prerequisites: {
                    requiresPod: true
                },
                objectives: [
                    'Identify a failing Pod',
                    'Check logs',
                    'Fix and recreate the Pod'
                ],
                hint: 'Try: kubectl logs <pod-name>',
                exampleCommand: 'kubectl logs <pod-name>',
                completed: false,
                xpReward: 200,
                checkCompletion: (_eventType: string, _data: any) => {
                    // This would need to check if a previously failing pod is now running
                    return true; // Simplified for now
                }
            },
            {
                id: 15,
                title: 'Deploy a Multi-Component Application',
                description: 'Deploy a full 3-tier application combining everything you\'ve learned.',
                explanation: 'Combines everything learned so far. Real-world applications require multiple components working together: Deployments for running applications, Services for networking, ConfigMaps for configuration, and proper resource management. This challenge tests your ability to orchestrate these components.',
                whyThisMatters: 'Replicates real-world Kubernetes deployments. In production, you\'ll deploy complex applications with multiple components. This final challenge demonstrates your ability to combine all the concepts you\'ve learned into a cohesive, production-like system.',
                storyIntro: 'The final trial awaits. Combine all your knowledge to build a production-ready application stack. You are now a Guardian of Production.',
                chapter: 5,
                xp: 150,
                prerequisites: {
                    requiresDeployment: true,
                    requiresService: true
                },
                objectives: [
                    'Deploy backend Deployment',
                    'Deploy frontend Deployment',
                    'Expose services',
                    'Use ConfigMaps for configuration'
                ],
                hint: 'Use YAML files for multi-component deployments',
                exampleCommand: 'kubectl create deployment backend --image=nginx && kubectl create deployment frontend --image=nginx && kubectl create service clusterip backend --tcp=80:80',
                completed: false,
                xpReward: 500,
                checkCompletion: (_eventType: string, _data: any) => {
                    // Would need to check for multiple resources
                    return false; // Placeholder - needs implementation
                }
            }
        ];
        
        console.log(`[FundamentalsMissions] Returning ${missions.length} missions`);
        return missions;
    }
}
