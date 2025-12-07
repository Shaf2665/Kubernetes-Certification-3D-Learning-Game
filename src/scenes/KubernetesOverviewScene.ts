import { Engine, Scene } from '@babylonjs/core';
import { EducationalSceneBase, EducationalSceneConfig } from './base/EducationalSceneBase.js';

/**
 * Kubernetes Overview scene - Explains what Kubernetes is and why it exists
 */
export class KubernetesOverviewScene {
    static async create(engine: Engine): Promise<Scene> {
        const config: EducationalSceneConfig = {
            title: 'What is Kubernetes?',
            moduleName: 'kubernetesOverview',
            nextScene: 'containers',
            showBackButton: true,
            content: `
                <div style="margin-bottom: 30px;">
                    <p style="font-size: 20px; color: #fff; margin-bottom: 15px;">
                        <strong>Kubernetes (K8s) is an open-source container orchestration platform</strong>
                    </p>
                    <p>
                        Originally developed by Google, Kubernetes automates the deployment, scaling, and management of containerized applications. 
                        It helps you manage clusters of containers across multiple machines.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                    <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                        <strong>Why does Kubernetes exist?</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;"><strong>Scale applications:</strong> Automatically scale up or down based on demand</li>
                        <li style="margin-bottom: 10px;"><strong>High availability:</strong> Keep applications running even if some containers fail</li>
                        <li style="margin-bottom: 10px;"><strong>Resource management:</strong> Efficiently use compute resources across a cluster</li>
                        <li style="margin-bottom: 10px;"><strong>Rolling updates:</strong> Update applications without downtime</li>
                        <li style="margin-bottom: 10px;"><strong>Service discovery:</strong> Automatically find and connect services</li>
                    </ul>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                        <strong>Problems Kubernetes solves:</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Managing hundreds or thousands of containers manually is impossible</li>
                        <li style="margin-bottom: 10px;">Ensuring containers restart when they crash</li>
                        <li style="margin-bottom: 10px;">Distributing load across multiple servers</li>
                        <li style="margin-bottom: 10px;">Coordinating updates across multiple containers</li>
                        <li style="margin-bottom: 10px;">Managing networking between containers</li>
                    </ul>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid #4caf50;">
                    <p style="font-size: 18px; color: #4caf50; margin-bottom: 15px;">
                        <strong>Real-world usage:</strong>
                    </p>
                    <p>
                        Kubernetes is used by companies like Google, Amazon, Microsoft, Netflix, Spotify, and thousands of others 
                        to run their production workloads. It's the de facto standard for container orchestration in the cloud.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                    <p style="font-size: 18px; color: #fff; margin-bottom: 15px;">
                        <strong>📊 The Kubernetes Hierarchy:</strong>
                    </p>
                    <div style="text-align: center; font-size: 14px; color: #aaa;">
                        <p>Applications → Containers → Pods → Deployments → Services</p>
                        <p style="margin-top: 10px;">Each level provides more abstraction and automation</p>
                    </div>
                </div>
            `
        };

        return EducationalSceneBase.create(engine, config);
    }
}

