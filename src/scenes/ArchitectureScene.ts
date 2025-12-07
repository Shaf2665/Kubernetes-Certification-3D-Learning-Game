import { Engine, Scene } from '@babylonjs/core';
import { EducationalSceneBase, EducationalSceneConfig } from './base/EducationalSceneBase.js';

/**
 * Architecture scene - Explains Kubernetes architecture components
 */
export class ArchitectureScene {
    static async create(engine: Engine): Promise<Scene> {
        const config: EducationalSceneConfig = {
            title: 'Kubernetes Architecture',
            moduleName: 'architecture',
            nextScene: 'setup',
            showBackButton: true,
            content: `
                <div style="margin-bottom: 30px;">
                    <p style="font-size: 20px; color: #fff; margin-bottom: 15px;">
                        <strong>Kubernetes Cluster Architecture</strong>
                    </p>
                    <p>
                        A Kubernetes cluster consists of a control plane (manages the cluster) and worker nodes (run your applications).
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                    <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                        <strong>🎛️ Control Plane Components</strong>
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4a90e2;">API Server</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Front-end for Kubernetes. All communication goes through the API Server.</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4a90e2;">etcd</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Distributed key-value store. Stores all cluster data and configuration.</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4a90e2;">Scheduler</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Decides which node should run each pod based on resources and constraints.</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4a90e2;">Controller Manager</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Runs controllers that maintain desired state (Deployments, ReplicaSets, etc.).</p>
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                        <strong>🖥️ Node Components</strong>
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #ffc107;">Kubelet</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Agent that runs on each node. Manages pods and communicates with the control plane.</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #ffc107;">Kube Proxy</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Maintains network rules. Enables Service networking and load balancing.</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #ffc107;">Container Runtime</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Software that runs containers (Docker, containerd, CRI-O).</p>
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                    <p style="font-size: 18px; color: #fff; margin-bottom: 15px;">
                        <strong>📊 Architecture Flow</strong>
                    </p>
                    <div style="text-align: center; font-size: 14px; color: #aaa; line-height: 2;">
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #4a90e2;">Control Plane</strong> → 
                            <span style="color: #888;">Schedules</span> → 
                            <strong style="color: #ffc107;">Worker Nodes</strong> → 
                            <span style="color: #888;">Run</span> → 
                            <strong style="color: #4caf50;">Pods</strong>
                        </div>
                        <div style="padding: 15px; background: rgba(74, 144, 226, 0.1); border-radius: 5px; margin-top: 10px;">
                            <p style="margin: 5px 0;">1. You create a Deployment via kubectl</p>
                            <p style="margin: 5px 0;">2. API Server receives the request</p>
                            <p style="margin: 5px 0;">3. Scheduler assigns pods to nodes</p>
                            <p style="margin: 5px 0;">4. Kubelet on nodes creates containers</p>
                            <p style="margin: 5px 0;">5. Controller Manager ensures desired state</p>
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid #4caf50;">
                    <p style="font-size: 18px; color: #4caf50; margin-bottom: 15px;">
                        <strong>Key Takeaway</strong>
                    </p>
                    <p>
                        The control plane makes decisions and maintains state, while worker nodes execute those decisions 
                        by running your containers. This separation allows Kubernetes to scale and manage large clusters efficiently.
                    </p>
                </div>
            `
        };

        return EducationalSceneBase.create(engine, config);
    }
}

