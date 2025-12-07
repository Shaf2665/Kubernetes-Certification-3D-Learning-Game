import { Engine, Scene } from '@babylonjs/core';
import { EducationalSceneBase, EducationalSceneConfig } from './base/EducationalSceneBase.js';

/**
 * Networking scene - Explains Kubernetes networking and Services
 */
export class NetworkingScene {
    static async create(engine: Engine): Promise<Scene> {
        const config: EducationalSceneConfig = {
            title: 'Kubernetes Networking',
            moduleName: 'networking',
            nextScene: 'microservices',
            showBackButton: true,
            content: `
                <div style="margin-bottom: 30px;">
                    <p style="font-size: 20px; color: #fff; margin-bottom: 15px;">
                        <strong>How Networking Works in Kubernetes</strong>
                    </p>
                    <p>
                        Kubernetes provides a flat network model where every Pod can communicate with every other Pod 
                        without NAT (Network Address Translation).
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                    <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                        <strong>🌐 Pod Networking</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Each Pod gets its own unique IP address</li>
                        <li style="margin-bottom: 10px;">Pods can communicate directly using their IPs</li>
                        <li style="margin-bottom: 10px;">No need to map ports between host and container</li>
                        <li style="margin-bottom: 10px;">Network is flat - all Pods can reach each other</li>
                    </ul>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                        <strong>🔌 Why Services Are Needed</strong>
                    </p>
                    <p style="margin-bottom: 15px;">
                        Pods are ephemeral - they can be created and destroyed. Their IP addresses change. 
                        <strong>Services</strong> provide a stable endpoint that doesn't change.
                    </p>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        <p style="margin: 5px 0;"><strong>Problem:</strong> Pod IPs change when Pods restart</p>
                        <p style="margin: 5px 0;"><strong>Solution:</strong> Service provides stable IP/DNS name</p>
                        <p style="margin: 5px 0;"><strong>Result:</strong> Other Pods can reliably find your application</p>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid #4caf50;">
                    <p style="font-size: 18px; color: #4caf50; margin-bottom: 15px;">
                        <strong>🎯 Service Types</strong>
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 15px; margin-top: 15px;">
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4caf50;">ClusterIP (Default)</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">
                                Exposes the Service on an internal IP. Only accessible within the cluster. 
                                Perfect for internal communication between Pods.
                            </p>
                            <div style="margin-top: 10px; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px; font-family: monospace; font-size: 12px; color: #aaa;">
                                Pod → ClusterIP Service → Pods
                            </div>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #ffc107;">NodePort</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">
                                Exposes the Service on each Node's IP at a static port (30000-32767). 
                                External traffic can access the Service via <code style="background: rgba(255, 193, 7, 0.2); padding: 2px 5px; border-radius: 3px;">&lt;NodeIP&gt;:&lt;NodePort&gt;</code>
                            </p>
                            <div style="margin-top: 10px; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px; font-family: monospace; font-size: 12px; color: #aaa;">
                                External → NodeIP:NodePort → Service → Pods
                            </div>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4a90e2;">LoadBalancer</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">
                                Creates an external load balancer (cloud provider specific). Automatically routes external 
                                traffic to the Service. Used in cloud environments (EKS, GKE, AKS).
                            </p>
                            <div style="margin-top: 10px; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px; font-family: monospace; font-size: 12px; color: #aaa;">
                                Internet → LoadBalancer → Service → Pods
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(156, 39, 176, 0.1); border-radius: 8px; border-left: 4px solid #9c27b0;">
                    <p style="font-size: 18px; color: #9c27b0; margin-bottom: 15px;">
                        <strong>🔍 Service Discovery</strong>
                    </p>
                    <p style="margin-bottom: 10px;">
                        Kubernetes provides DNS-based service discovery. Services are automatically assigned DNS names:
                    </p>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.5); border-radius: 5px; font-family: 'Courier New', monospace; font-size: 14px; color: #00ff00;">
                        <span style="color: #aaa;"># Service name: my-service</span><br>
                        <span style="color: #aaa;"># Namespace: default</span><br>
                        <span style="color: #4a90e2;">my-service.default.svc.cluster.local</span>
                    </div>
                    <p style="margin-top: 15px; font-size: 14px; color: #aaa;">
                        Pods can communicate using just the service name: <code style="background: rgba(156, 39, 176, 0.2); padding: 2px 5px; border-radius: 3px;">my-service</code>
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                    <p style="font-size: 18px; color: #fff; margin-bottom: 15px;">
                        <strong>💡 Key Takeaways</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Pods have ephemeral IPs - use Services for stable endpoints</li>
                        <li style="margin-bottom: 10px;">Services use labels to select which Pods to route traffic to</li>
                        <li style="margin-bottom: 10px;">ClusterIP for internal, NodePort/LoadBalancer for external access</li>
                        <li style="margin-bottom: 10px;">DNS makes service discovery automatic and easy</li>
                    </ul>
                </div>
            `
        };

        return EducationalSceneBase.create(engine, config);
    }
}

