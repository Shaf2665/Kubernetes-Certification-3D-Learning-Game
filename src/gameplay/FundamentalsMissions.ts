import { Mission } from './MissionsManager.js';

/**
 * Defines all 15 Kubernetes Fundamentals missions with educational content
 */
export class FundamentalsMissions {
    static getMissions(): Mission[] {
        console.log('[FundamentalsMissions] Getting missions...');
        const missions: Mission[] = [
            {
                id: 1,
                title: 'Create Your First Pod',
                description: 'Learn how to create the smallest deployable object in Kubernetes.',
                explanation: 'Pods are the fundamental execution units in Kubernetes. A Pod runs one or more containers and abstracts networking and storage management. Understanding Pods is the foundation of everything else in Kubernetes. Each Pod gets its own IP address and can communicate with other Pods in the cluster.',
                objectives: [
                    'Understand what a Pod is and its role in Kubernetes',
                    'Learn how Pods relate to containers',
                    'Use kubectl to create a real Pod in the simulator'
                ],
                hint: 'Pods are created using kubectl create pod. You need to specify a name and an image.',
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
                description: 'Create a deployment and scale it to multiple replicas to ensure high availability.',
                explanation: 'Deployments manage ReplicaSets, which in turn manage Pods. Scaling a Deployment allows you to run multiple instances of your application, providing redundancy and load distribution. When you scale up, Kubernetes creates new Pods. When you scale down, it terminates excess Pods gracefully.',
                objectives: [
                    'Create a Deployment using kubectl',
                    'Understand how Deployments manage Pod replicas',
                    'Scale the Deployment to 3 or more replicas',
                    'Observe how Kubernetes maintains the desired state'
                ],
                hint: 'First create a deployment, then use kubectl scale to increase the number of replicas. The command format is: kubectl scale deployment <name> --replicas=<number>',
                exampleCommand: 'kubectl scale deployment myapp --replicas=3',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, data: any) => {
                    return eventType === 'deploymentScaled' && data && data.replicas >= 3;
                }
            },
            {
                id: 3,
                title: 'Fix a CrashLoopBackOff Pod',
                description: 'Identify and resolve a Pod that is failing to start correctly.',
                explanation: 'CrashLoopBackOff occurs when a container in a Pod repeatedly crashes. Kubernetes keeps trying to restart it, but it fails again. Common causes include: application errors, missing environment variables, incorrect image configuration, or resource constraints. Understanding how to diagnose and fix these issues is crucial for maintaining healthy applications.',
                objectives: [
                    'Recognize CrashLoopBackOff status in Pods',
                    'Understand common causes of container crashes',
                    'Learn how to inspect Pod logs and events',
                    'Fix the issue and get the Pod running'
                ],
                hint: 'Check the Pod status and logs to understand why it\'s crashing. Common fixes include correcting environment variables, fixing the container image, or adjusting resource limits.',
                exampleCommand: 'kubectl get pods',
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
                description: 'Expose your Pods to other applications using a Kubernetes Service.',
                explanation: 'Services provide a stable network endpoint for Pods. Since Pods are ephemeral (they can be created and destroyed), Services give you a consistent way to access your application. Services use labels and selectors to route traffic to the correct Pods. There are three main Service types: ClusterIP (internal), NodePort (external via node IP), and LoadBalancer (cloud provider load balancer).',
                objectives: [
                    'Understand what Services are and why they\'re needed',
                    'Learn how Services use labels and selectors',
                    'Create a ClusterIP Service to expose Pods internally',
                    'Understand the difference between Service types'
                ],
                hint: 'Services are created with kubectl create service. You can specify the type with --type flag. ClusterIP is the default type for internal communication.',
                exampleCommand: 'kubectl create service clusterip myservice --tcp=80:8080',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, _data: any) => {
                    return eventType === 'serviceCreated';
                }
            },
            {
                id: 5,
                title: 'Use a ConfigMap',
                description: 'Store and manage configuration data separately from your application code.',
                explanation: 'ConfigMaps allow you to decouple configuration from container images. This makes your applications more portable and easier to manage. ConfigMaps can store key-value pairs, configuration files, or entire configuration directories. Pods can consume ConfigMaps as environment variables, command-line arguments, or as files in a volume. This separation of concerns is a best practice in cloud-native applications.',
                objectives: [
                    'Understand the purpose of ConfigMaps',
                    'Learn how ConfigMaps separate config from code',
                    'Create a ConfigMap with configuration data',
                    'Understand how Pods consume ConfigMaps'
                ],
                hint: 'ConfigMaps are created with kubectl create configmap. You can create them from literal values, files, or directories.',
                exampleCommand: 'kubectl create configmap myconfig --from-literal=key1=value1',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, _data: any) => {
                    return eventType === 'configMapCreated';
                }
            },
            {
                id: 6,
                title: 'Use a Secret',
                description: 'Store sensitive information like passwords and API keys securely.',
                explanation: 'Secrets are similar to ConfigMaps but designed for sensitive data like passwords, tokens, and keys. While Secrets are not encrypted by default (they\'re base64 encoded), Kubernetes provides mechanisms to encrypt them at rest. Secrets should never be committed to version control. They can be consumed by Pods in the same ways as ConfigMaps: as environment variables or volume mounts.',
                objectives: [
                    'Understand when to use Secrets vs ConfigMaps',
                    'Learn how Secrets store sensitive data',
                    'Create a Secret with sensitive information',
                    'Understand security best practices for Secrets'
                ],
                hint: 'Secrets are created with kubectl create secret. Use generic type for key-value pairs. Remember: Secrets are base64 encoded, not encrypted by default.',
                exampleCommand: 'kubectl create secret generic mysecret --from-literal=password=mypass',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, _data: any) => {
                    return eventType === 'secretCreated';
                }
            },
            {
                id: 7,
                title: 'Work with ReplicaSets',
                description: 'Understand how ReplicaSets ensure a specified number of Pod replicas are running.',
                explanation: 'ReplicaSets are the mechanism that ensures a desired number of Pod replicas are running at all times. Deployments use ReplicaSets to manage Pods. If a Pod fails or is deleted, the ReplicaSet automatically creates a new one to maintain the desired count. ReplicaSets use label selectors to identify which Pods they manage. Understanding this relationship helps you troubleshoot scaling and availability issues.',
                objectives: [
                    'Understand the relationship between Deployments, ReplicaSets, and Pods',
                    'Learn how ReplicaSets maintain desired replica counts',
                    'Observe automatic Pod recreation when Pods fail',
                    'Understand label selectors and how they work'
                ],
                hint: 'ReplicaSets are typically managed by Deployments. When you create a Deployment, Kubernetes automatically creates a ReplicaSet. You can observe this relationship by inspecting the resources.',
                exampleCommand: 'kubectl get replicasets',
                completed: false,
                xpReward: 150,
                checkCompletion: (eventType: string, _data: any) => {
                    // This could check if user has observed ReplicaSet behavior
                    return eventType === 'deploymentCreated'; // Simplified
                }
            },
            {
                id: 8,
                title: 'Create & Switch Namespaces',
                description: 'Organize and isolate resources using Kubernetes namespaces.',
                explanation: 'Namespaces provide a way to divide cluster resources between multiple users, teams, or projects. They act like virtual clusters within a physical cluster. Each namespace has its own set of resources (Pods, Services, ConfigMaps, etc.) and can have different access controls. Common namespaces include: default, kube-system (system components), and kube-public. Using namespaces helps organize resources and implement multi-tenancy.',
                objectives: [
                    'Understand what namespaces are and their purpose',
                    'Learn how namespaces provide resource isolation',
                    'Create a new namespace for your resources',
                    'Switch between namespaces using kubectl',
                    'Understand default namespaces in Kubernetes'
                ],
                hint: 'Namespaces are created with kubectl create namespace. You can switch your context to a namespace using kubectl config set-context or specify --namespace flag with commands.',
                exampleCommand: 'kubectl create namespace myapp',
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
                description: 'Control CPU and memory allocation for your Pods to ensure fair resource distribution.',
                explanation: 'Resource requests specify the minimum resources a Pod needs to run. Resource limits specify the maximum resources a Pod can use. The scheduler uses requests to place Pods on nodes with available resources. Limits prevent a Pod from consuming too many resources and affecting other Pods. This is crucial for multi-tenant clusters and helps prevent resource starvation. CPU is measured in cores (or millicores), memory in bytes (or Mi, Gi).',
                objectives: [
                    'Understand the difference between requests and limits',
                    'Learn how the scheduler uses resource requests',
                    'Set CPU and memory requests for a Pod',
                    'Set CPU and memory limits to prevent resource exhaustion',
                    'Understand resource units (cores, millicores, Mi, Gi)'
                ],
                hint: 'Resource requests and limits are specified in Pod specifications. You can set them using kubectl create with --requests and --limits flags, or in YAML manifests.',
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
                description: 'Set up health checks to ensure your application is running correctly.',
                explanation: 'Probes are health checks that Kubernetes performs on your containers. Liveness probes determine if a container is running. If it fails, Kubernetes restarts the container. Readiness probes determine if a container is ready to accept traffic. If it fails, the Pod is removed from Service endpoints. Startup probes give containers time to start before liveness/readiness checks begin. Properly configured probes ensure your application recovers from failures and doesn\'t receive traffic before it\'s ready.',
                objectives: [
                    'Understand the difference between liveness and readiness probes',
                    'Learn when each probe type is used',
                    'Configure a liveness probe for a Pod',
                    'Configure a readiness probe for a Pod',
                    'Understand probe types: HTTP, TCP, and Exec'
                ],
                hint: 'Probes are configured in Pod specifications. You can use HTTP (check endpoint), TCP (check port), or Exec (run command) probes. Liveness probes restart containers, readiness probes control traffic routing.',
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
                description: 'Add persistent storage to your Pods so data survives Pod restarts.',
                explanation: 'Volumes provide storage for Pods. There are many volume types: emptyDir (temporary), hostPath (node filesystem), and PersistentVolume (PV) with PersistentVolumeClaim (PVC). PVCs are requests for storage that get bound to PVs. StorageClasses define different storage types and provisioning. Persistent storage is essential for stateful applications like databases. Data in volumes persists even when Pods are deleted and recreated.',
                objectives: [
                    'Understand the difference between ephemeral and persistent storage',
                    'Learn about PersistentVolumes and PersistentVolumeClaims',
                    'Create a PersistentVolumeClaim',
                    'Attach the PVC to a Pod as a volume mount',
                    'Understand StorageClasses and dynamic provisioning'
                ],
                hint: 'First create a PersistentVolumeClaim, then reference it in your Pod specification under volumes. The PVC will be mounted at a specified path in the container.',
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
                description: 'Control which nodes your Pods are scheduled on using affinity rules.',
                explanation: 'Node affinity allows you to constrain which nodes your Pod can be scheduled on. This is useful for: ensuring Pods run on nodes with specific hardware (GPUs, SSDs), co-locating Pods for performance, or separating workloads for security. There are two types: required (hard requirement) and preferred (soft preference). Affinity rules use node labels to match nodes. This gives you fine-grained control over Pod placement.',
                objectives: [
                    'Understand what node affinity is and when to use it',
                    'Learn the difference between required and preferred affinity',
                    'Create a Pod with node affinity rules',
                    'Understand how node labels are used in affinity',
                    'Learn about node selectors (simpler form of affinity)'
                ],
                hint: 'Node affinity is specified in Pod specifications. You can use matchExpressions with operators like In, NotIn, Exists. Node selectors are a simpler way to match node labels.',
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
                title: 'Expose an Application via NodePort',
                description: 'Make your application accessible from outside the cluster using NodePort Service.',
                explanation: 'NodePort Services expose your application on a port on each node in the cluster. External traffic can access your application by connecting to any node\'s IP address on the NodePort. Kubernetes automatically allocates a port in the 30000-32767 range, or you can specify one. NodePort is useful for development and testing, but for production, LoadBalancer or Ingress are typically preferred. NodePort works by opening a port on each node and forwarding traffic to the Service.',
                objectives: [
                    'Understand how NodePort Services work',
                    'Learn the difference between ClusterIP, NodePort, and LoadBalancer',
                    'Create a NodePort Service to expose your application',
                    'Access your application from outside the cluster',
                    'Understand port ranges and how NodePort allocates ports'
                ],
                hint: 'Create a Service with type NodePort. You can specify the port with --node-port flag, or let Kubernetes assign one automatically. Then access your app via <node-ip>:<node-port>.',
                exampleCommand: 'kubectl create service nodeport myapp --tcp=80:8080 --node-port=30080',
                completed: false,
                xpReward: 200,
                checkCompletion: (eventType: string, data: any) => {
                    return eventType === 'serviceCreated' && data && data.type === 'NodePort';
                }
            },
            {
                id: 14,
                title: 'Inspect Cluster Events',
                description: 'Monitor and understand cluster events to troubleshoot issues.',
                explanation: 'Kubernetes Events provide a record of what has happened in your cluster. They show when resources are created, updated, deleted, or when errors occur. Events help you understand the lifecycle of resources and diagnose problems. Common events include: Pod scheduled, image pulled, container started, and various error conditions. Viewing events is often the first step in troubleshooting issues with your applications.',
                objectives: [
                    'Understand what Kubernetes Events are',
                    'Learn how to view events for resources',
                    'Interpret event messages and their meanings',
                    'Use events to troubleshoot Pod and Deployment issues',
                    'Understand event types: Normal, Warning, Error'
                ],
                hint: 'Use kubectl get events to view all events, or kubectl describe pod <name> to see events for a specific resource. Events show timestamps and detailed messages about what happened.',
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
                title: 'Final Challenge: Build a Complete Application Stack',
                description: 'Combine everything you\'ve learned to create a production-like application stack.',
                explanation: 'Real-world applications require multiple components working together: Deployments for running applications, Services for networking, ConfigMaps for configuration, and proper resource management. This final challenge tests your ability to orchestrate these components into a cohesive system. You\'ll create a multi-tier application with proper separation of concerns, demonstrating your understanding of Kubernetes fundamentals.',
                objectives: [
                    'Create a Deployment with multiple replicas',
                    'Expose the Deployment with a Service',
                    'Store configuration in a ConfigMap',
                    'Scale the Deployment to handle load',
                    'Apply resource limits to ensure fair resource usage',
                    'Verify all components are working together'
                ],
                hint: 'Start by creating a Deployment, then create a Service to expose it. Add a ConfigMap for configuration. Scale the Deployment to 3+ replicas. This demonstrates a complete application stack.',
                exampleCommand: 'kubectl create deployment myapp --image=nginx && kubectl create service clusterip myapp --tcp=80:80 && kubectl scale deployment myapp --replicas=3',
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
