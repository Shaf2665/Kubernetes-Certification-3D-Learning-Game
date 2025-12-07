import { Engine, Scene } from '@babylonjs/core';
import { EducationalSceneBase, EducationalSceneConfig } from './base/EducationalSceneBase.js';

/**
 * Kubernetes Setup scene - Explains how to set up Kubernetes
 */
export class KubernetesSetupScene {
    static async create(engine: Engine): Promise<Scene> {
        const config: EducationalSceneConfig = {
            title: 'Setting Up Kubernetes',
            moduleName: 'setup',
            nextScene: 'yaml',
            showBackButton: true,
            content: `
                <div style="margin-bottom: 30px;">
                    <p style="font-size: 20px; color: #fff; margin-bottom: 15px;">
                        <strong>Getting Started with Kubernetes</strong>
                    </p>
                    <p>
                        There are several ways to set up and run Kubernetes, from local development to production cloud clusters.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                    <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                        <strong>💻 Local Setup: Minikube</strong>
                    </p>
                    <p style="margin-bottom: 15px;">
                        Minikube runs a single-node Kubernetes cluster on your local machine. Perfect for learning and development.
                    </p>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.5); border-radius: 5px; font-family: 'Courier New', monospace; font-size: 14px; color: #00ff00;">
                        <div style="margin-bottom: 10px;">
                            <span style="color: #4a90e2;"># Install Minikube</span><br>
                            <span style="color: #aaa;"># Visit: https://minikube.sigs.k8s.io/docs/start/</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <span style="color: #4a90e2;">$</span> minikube start<br>
                            <span style="color: #aaa;">✓ Starting cluster...</span>
                        </div>
                        <div>
                            <span style="color: #4a90e2;">$</span> kubectl get nodes<br>
                            <span style="color: #aaa;">NAME       STATUS   ROLES           AGE</span><br>
                            <span style="color: #4caf50;">minikube   Ready    control-plane   1m</span>
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                        <strong>☁️ Cloud Setup: Managed Clusters</strong>
                    </p>
                    <p style="margin-bottom: 15px;">
                        Cloud providers offer managed Kubernetes services that handle the control plane for you:
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #ffc107;">Amazon EKS</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Elastic Kubernetes Service - AWS managed K8s</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #ffc107;">Google GKE</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Google Kubernetes Engine - GCP managed K8s</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #ffc107;">Azure AKS</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Azure Kubernetes Service - Microsoft managed K8s</p>
                        </div>
                    </div>
                    <p style="margin-top: 15px; font-size: 14px; color: #aaa;">
                        Managed services handle control plane updates, scaling, and maintenance automatically.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid #4caf50;">
                    <p style="font-size: 18px; color: #4caf50; margin-bottom: 15px;">
                        <strong>⚙️ kubeconfig Basics</strong>
                    </p>
                    <p style="margin-bottom: 15px;">
                        Kubernetes uses a config file to manage access to clusters. The default location is:
                    </p>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.5); border-radius: 5px; font-family: 'Courier New', monospace; font-size: 14px; color: #00ff00;">
                        <span style="color: #4a90e2;">$</span> cat ~/.kube/config<br>
                        <span style="color: #aaa;">apiVersion: v1</span><br>
                        <span style="color: #aaa;">clusters:</span><br>
                        <span style="color: #aaa;">  - cluster:</span><br>
                        <span style="color: #aaa;">      server: https://...</span><br>
                        <span style="color: #aaa;">    name: my-cluster</span>
                    </div>
                    <p style="margin-top: 15px; font-size: 14px; color: #aaa;">
                        kubectl uses this file to know which cluster to connect to and how to authenticate.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                    <p style="font-size: 18px; color: #fff; margin-bottom: 15px;">
                        <strong>💡 For This Game</strong>
                    </p>
                    <p>
                        You don't need to install Kubernetes to play this game! The simulator provides a safe, 
                        interactive environment to learn Kubernetes concepts without setting up a real cluster.
                    </p>
                </div>
            `
        };

        return EducationalSceneBase.create(engine, config);
    }
}

