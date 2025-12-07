import { Engine, Scene } from '@babylonjs/core';
import { EducationalSceneBase, EducationalSceneConfig } from './base/EducationalSceneBase.js';

/**
 * Containers Overview scene - Explains containers and their role
 */
export class ContainersOverviewScene {
    static async create(engine: Engine): Promise<Scene> {
        const config: EducationalSceneConfig = {
            title: 'Containers Overview',
            moduleName: 'containers',
            nextScene: 'orchestration',
            showBackButton: true,
            content: `
                <div style="margin-bottom: 30px;">
                    <p style="font-size: 20px; color: #fff; margin-bottom: 15px;">
                        <strong>What is a Container?</strong>
                    </p>
                    <p>
                        A container is a lightweight, portable unit that packages an application and all its dependencies 
                        (code, runtime, libraries, config files) into a single package. Containers run consistently across 
                        different environments.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                    <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                        <strong>Containers vs Virtual Machines</strong>
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4a90e2;">Virtual Machines</strong>
                            <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
                                <li>Full OS per VM</li>
                                <li>Heavy resource usage</li>
                                <li>Slow startup</li>
                                <li>Isolated at hardware level</li>
                            </ul>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4caf50;">Containers</strong>
                            <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
                                <li>Share host OS kernel</li>
                                <li>Lightweight & fast</li>
                                <li>Quick startup</li>
                                <li>Isolated at process level</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                        <strong>Images vs Containers</strong>
                    </p>
                    <p style="margin-bottom: 10px;">
                        <strong>Image:</strong> A read-only template used to create containers. Think of it as a blueprint.
                    </p>
                    <p style="margin-bottom: 10px;">
                        <strong>Container:</strong> A running instance of an image. Multiple containers can run from the same image.
                    </p>
                    <div style="margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px; font-family: monospace; font-size: 14px;">
                        docker pull nginx  # Download image<br>
                        docker run nginx   # Create container from image
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid #4caf50;">
                    <p style="font-size: 18px; color: #4caf50; margin-bottom: 15px;">
                        <strong>Why Containers Matter in Kubernetes</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Kubernetes orchestrates containers, not VMs</li>
                        <li style="margin-bottom: 10px;">Containers are packaged into Pods (Kubernetes' smallest unit)</li>
                        <li style="margin-bottom: 10px;">Portability: same container runs on any Kubernetes cluster</li>
                        <li style="margin-bottom: 10px;">Efficiency: better resource utilization than VMs</li>
                        <li style="margin-bottom: 10px;">Fast scaling: containers start in seconds</li>
                    </ul>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                    <p style="font-size: 18px; color: #fff; margin-bottom: 15px;">
                        <strong>📦 Container → Pod → Deployment</strong>
                    </p>
                    <div style="text-align: center; font-size: 14px; color: #aaa;">
                        <p>Container (runs your app) → Pod (wraps container) → Deployment (manages pods)</p>
                        <p style="margin-top: 10px;">This hierarchy is the foundation of Kubernetes!</p>
                    </div>
                </div>
            `
        };

        return EducationalSceneBase.create(engine, config);
    }
}

