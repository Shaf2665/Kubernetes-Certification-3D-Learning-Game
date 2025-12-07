import { Mission } from './MissionsManager.js';

/**
 * Defines all 15 Kubernetes Fundamentals missions with full educational content
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
                title: 'Scale a Deployment',
                description: 'Deployments manage Pods and ensure the desired number of replicas are running.',
                explanation: 'Deployments use ReplicaSets to maintain Pod count automatically. When you scale a Deployment, Kubernetes creates or removes Pods to match your desired state. This provides high availability and load distribution across your application.',
                whyThisMatters: 'Deployments provide self-healing, rolling updates, and stable app management. In production, you need multiple replicas to handle traffic and survive failures. Scaling is a fundamental operation for maintaining application availability.',
                objectives: [
                    'Create a Deployment',
                    'Scale it up using kubectl'
                ],
                hint: 'Try: kubectl scale deployment mydeploy --replicas=3',
                exampleCommand: 'kubectl scale deployment mydeploy --replicas=3',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, data: any) => {
                    return eventType === 'deploymentScaled' && data && data.replicas >= 3;
                }
            },
            {
                id: 3,
                title: 'Fix a CrashLoopBackOff',
                description: 'Some Pods crash repeatedly due to configuration or runtime errors.',
                explanation: 'CrashLoopBackOff indicates repeated failure; debugging is key. This happens when a container starts, crashes, and Kubernetes keeps trying to restart it. Common causes include application errors, missing environment variables, incorrect image configuration, or resource constraints.',
                whyThisMatters: 'Understanding Pod failures is critical to troubleshooting real clusters. In production, you\'ll encounter failing Pods regularly. Knowing how to diagnose and fix them quickly is essential for maintaining system reliability.',
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
                id: 4,
                title: 'Create a Service',
                description: 'Services expose Pods to stable networking inside or outside the cluster.',
                explanation: 'Pods have ephemeral IPs; Services provide stable access. Since Pods can be created and destroyed, their IP addresses change. Services provide a stable endpoint that routes traffic to the correct Pods using labels and selectors.',
                whyThisMatters: 'Without Services, Pods cannot reliably communicate. Services are essential for microservices architectures where different components need to find and talk to each other. They abstract away Pod lifecycle and provide consistent networking.',
                objectives: [
                    'Create a Service',
                    'Understand ClusterIP behavior'
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
                title: 'Use a ConfigMap',
                description: 'ConfigMaps store non-sensitive configuration data.',
                explanation: 'They allow injecting environment variables or config files. ConfigMaps decouple configuration from container images, making applications more portable. You can create them from literal values, files, or directories, and mount them into Pods.',
                whyThisMatters: 'Separates config from container images, a Kubernetes best practice. This allows you to use the same container image across different environments (dev, staging, prod) by just changing the ConfigMap. It\'s a fundamental pattern in cloud-native applications.',
                objectives: [
                    'Create a ConfigMap',
                    'Mount it or use env variables'
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
                id: 6,
                title: 'Use a Secret',
                description: 'Secrets store sensitive information like passwords.',
                explanation: 'They are base64-encoded objects used securely within Pods. Secrets are similar to ConfigMaps but designed for sensitive data. While not encrypted by default, they should never be committed to version control and can be encrypted at rest in production clusters.',
                whyThisMatters: 'Security is essential; Secrets prevent hardcoding credentials. In real-world applications, you need to store database passwords, API keys, and certificates securely. Using Secrets is the proper way to handle sensitive data in Kubernetes.',
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
                id: 7,
                title: 'Understand ReplicaSets',
                description: 'ReplicaSets ensure the correct number of Pod replicas.',
                explanation: 'Deployments create ReplicaSets as controllers. ReplicaSets use label selectors to identify which Pods they manage. If a Pod is deleted or fails, the ReplicaSet automatically creates a new one to maintain the desired count.',
                whyThisMatters: 'Understanding the Pod → ReplicaSet → Deployment chain is foundational. This hierarchy is crucial for understanding how Kubernetes maintains desired state. When troubleshooting, you need to understand how these components interact.',
                objectives: [
                    'Inspect ReplicaSets',
                    'Delete a Pod and watch it regenerate'
                ],
                hint: 'kubectl get rs',
                exampleCommand: 'kubectl get rs',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, _data: any) => {
                    // This could check if user has observed ReplicaSet behavior
                    return eventType === 'deploymentCreated'; // Simplified
                }
            },
            {
                id: 8,
                title: 'Create a Namespace',
                description: 'Namespaces isolate resources within a cluster.',
                explanation: 'Useful for teams, environments, or permissions. Namespaces act like virtual clusters within a physical cluster. Each namespace has its own set of resources and can have different access controls. Common namespaces include default, kube-system, and kube-public.',
                whyThisMatters: 'Organizing workloads prevents naming conflicts and improves security. In multi-tenant environments, namespaces are essential for separating different teams or projects. They also help organize resources and implement RBAC policies.',
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
                title: 'Attach a Volume / PVC',
                description: 'Volumes store persistent data for Pods.',
                explanation: 'PVCs bind to PVs for dynamic storage. PersistentVolumeClaims (PVCs) are requests for storage that get bound to PersistentVolumes (PVs). StorageClasses define different storage types and enable dynamic provisioning. Data in volumes persists even when Pods are deleted.',
                whyThisMatters: 'Stateful workloads rely on persistent storage. Databases, file storage, and stateful applications need data to survive Pod restarts. Understanding volumes is essential for deploying stateful applications in Kubernetes.',
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
                title: 'Use Node Affinity Rules',
                description: 'Affinity lets you choose which nodes Pods prefer or require.',
                explanation: 'Useful for performance, compliance, or hardware constraints. Node affinity allows you to constrain which nodes your Pod can be scheduled on. There are two types: required (hard requirement) and preferred (soft preference). This gives fine-grained control over Pod placement.',
                whyThisMatters: 'Gives fine control over Pod scheduling. You might need Pods on nodes with specific hardware (GPUs, SSDs), for compliance reasons, or to co-locate Pods for performance. Understanding affinity is important for advanced cluster management.',
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
                title: 'Expose an Application (NodePort)',
                description: 'NodePort lets external traffic reach your application.',
                explanation: 'Simplest form of service exposure. NodePort Services expose your application on a port on each node in the cluster. External traffic can access your application by connecting to any node\'s IP address on the NodePort. Kubernetes allocates a port in the 30000-32767 range.',
                whyThisMatters: 'Essential for accessing applications outside the cluster. While NodePort is simple, it\'s useful for development and testing. In production, LoadBalancer or Ingress are typically preferred, but understanding NodePort is foundational.',
                objectives: [
                    'Create NodePort service'
                ],
                hint: 'kubectl expose deployment myapp --type=NodePort',
                exampleCommand: 'kubectl expose deployment myapp --type=NodePort --port=80',
                completed: false,
                xpReward: 200,
                checkCompletion: (eventType: string, data: any) => {
                    return eventType === 'serviceCreated' && data && data.type === 'NodePort';
                }
            },
            {
                id: 14,
                title: 'Inspect Cluster Events',
                description: 'Events provide insight into what the cluster is doing.',
                explanation: 'They help diagnose scheduling issues and warnings. Kubernetes Events provide a record of what has happened in your cluster. They show when resources are created, updated, deleted, or when errors occur. Events help you understand the lifecycle of resources and diagnose problems.',
                whyThisMatters: 'Understanding events is key to debugging. When something goes wrong, events are often the first place to look. They provide detailed information about what Kubernetes is doing and why operations succeed or fail.',
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
                id: 15,
                title: 'Build a Small App Stack',
                description: 'Deploy a full 3-tier application.',
                explanation: 'Combines everything learned so far. Real-world applications require multiple components working together: Deployments for running applications, Services for networking, ConfigMaps for configuration, and proper resource management. This challenge tests your ability to orchestrate these components.',
                whyThisMatters: 'Replicates real-world Kubernetes deployments. In production, you\'ll deploy complex applications with multiple components. This final challenge demonstrates your ability to combine all the concepts you\'ve learned into a cohesive, production-like system.',
                objectives: [
                    'Deploy backend',
                    'Deploy frontend',
                    'Expose service'
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
