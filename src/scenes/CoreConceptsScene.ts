import { Engine, Scene } from '@babylonjs/core';
import { EducationalSceneBase, EducationalSceneConfig } from './base/EducationalSceneBase.js';

/**
 * Core Concepts scene - Explains Pods, ReplicaSets, Deployments
 */
export class CoreConceptsScene {
    static async create(engine: Engine): Promise<Scene> {
        const config: EducationalSceneConfig = {
            title: 'Core Kubernetes Objects',
            moduleName: 'coreConcepts',
            nextScene: 'networking',
            showBackButton: true,
            content: `
                <div style="margin-bottom: 30px;">
                    <p style="font-size: 20px; color: #fff; margin-bottom: 15px;">
                        <strong>Understanding Kubernetes Core Objects</strong>
                    </p>
                    <p>
                        Kubernetes uses several core objects to manage containerized applications. Understanding these is essential.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                    <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                        <strong>📦 Pods</strong>
                    </p>
                    <p style="margin-bottom: 10px;">
                        <strong>Pods</strong> are the smallest deployable unit in Kubernetes. A Pod can contain one or more containers 
                        that share storage and network resources.
                    </p>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                        <li>Each Pod gets its own IP address</li>
                        <li>Containers in a Pod share the same network namespace</li>
                        <li>Pods are ephemeral - they can be created and destroyed</li>
                    </ul>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                        <strong>🔄 ReplicaSets</strong>
                    </p>
                    <p style="margin-bottom: 10px;">
                        <strong>ReplicaSets</strong> ensure a specified number of Pod replicas are running at any given time.
                    </p>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                        <li>Maintains desired number of Pods</li>
                        <li>Automatically creates new Pods if one fails</li>
                        <li>Uses label selectors to identify Pods</li>
                        <li>Usually managed by Deployments (you rarely create ReplicaSets directly)</li>
                    </ul>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid #4caf50;">
                    <p style="font-size: 18px; color: #4caf50; margin-bottom: 15px;">
                        <strong>🚀 Deployments</strong>
                    </p>
                    <p style="margin-bottom: 10px;">
                        <strong>Deployments</strong> are the recommended way to manage Pods. They provide declarative updates, 
                        rolling updates, and rollback capabilities.
                    </p>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                        <li>Manages ReplicaSets, which manage Pods</li>
                        <li>Enables rolling updates without downtime</li>
                        <li>Supports rollback to previous versions</li>
                        <li>Provides self-healing capabilities</li>
                    </ul>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                    <p style="font-size: 18px; color: #fff; margin-bottom: 15px;">
                        <strong>📊 The Hierarchy</strong>
                    </p>
                    <div style="text-align: center; font-size: 14px; color: #aaa; line-height: 2;">
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #4caf50;">Deployment</strong> → 
                            <span style="color: #888;">creates/manages</span> → 
                            <strong style="color: #ffc107;">ReplicaSet</strong> → 
                            <span style="color: #888;">creates/manages</span> → 
                            <strong style="color: #4a90e2;">Pods</strong>
                        </div>
                        <div style="padding: 15px; background: rgba(74, 144, 226, 0.1); border-radius: 5px; margin-top: 10px;">
                            <p style="margin: 5px 0;"><strong>Example:</strong></p>
                            <p style="margin: 5px 0;">You create a Deployment with 3 replicas</p>
                            <p style="margin: 5px 0;">↓</p>
                            <p style="margin: 5px 0;">Deployment creates a ReplicaSet</p>
                            <p style="margin: 5px 0;">↓</p>
                            <p style="margin: 5px 0;">ReplicaSet creates 3 Pods</p>
                            <p style="margin: 5px 0;">↓</p>
                            <p style="margin: 5px 0;">Each Pod runs your container</p>
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(244, 67, 54, 0.1); border-radius: 8px; border-left: 4px solid #f44336;">
                    <p style="font-size: 18px; color: #f44336; margin-bottom: 15px;">
                        <strong>🔄 Rolling Updates & Rollbacks</strong>
                    </p>
                    <p style="margin-bottom: 15px;">
                        When you update a Deployment (e.g., change the container image), Kubernetes performs a rolling update:
                    </p>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <span style="color: #4caf50;">1.</span>
                            <span>Create new Pods with updated version</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <span style="color: #4caf50;">2.</span>
                            <span>Wait for new Pods to be ready</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <span style="color: #4caf50;">3.</span>
                            <span>Gradually replace old Pods</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span style="color: #4caf50;">4.</span>
                            <span>Zero downtime achieved!</span>
                        </div>
                    </div>
                    <p style="margin-top: 15px; font-size: 14px; color: #aaa;">
                        If something goes wrong, you can rollback to the previous version instantly.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(156, 39, 176, 0.1); border-radius: 8px; border-left: 4px solid #9c27b0;">
                    <p style="font-size: 18px; color: #9c27b0; margin-bottom: 15px;">
                        <strong>💚 Self-Healing</strong>
                    </p>
                    <p>
                        Kubernetes automatically detects when a Pod fails and replaces it. This self-healing behavior ensures 
                        your application stays available even when individual containers crash.
                    </p>
                </div>
            `
        };

        return EducationalSceneBase.create(engine, config);
    }
}

