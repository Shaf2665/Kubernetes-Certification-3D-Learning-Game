import { Engine, Scene } from '@babylonjs/core';
import { EducationalSceneBase, EducationalSceneConfig } from './base/EducationalSceneBase.js';

/**
 * Orchestration Overview scene - Explains container orchestration
 */
export class OrchestrationOverviewScene {
    static async create(engine: Engine): Promise<Scene> {
        const config: EducationalSceneConfig = {
            title: 'Container Orchestration',
            moduleName: 'orchestration',
            nextScene: 'architecture',
            showBackButton: true,
            content: `
                <div style="margin-bottom: 30px;">
                    <p style="font-size: 20px; color: #fff; margin-bottom: 15px;">
                        <strong>What is Container Orchestration?</strong>
                    </p>
                    <p>
                        Container orchestration is the automated management of containerized applications. It handles 
                        deployment, scaling, networking, and lifecycle management of containers across a cluster of machines.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                    <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                        <strong>Why Orchestration is Needed</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Managing hundreds of containers manually is impossible</li>
                        <li style="margin-bottom: 10px;">Containers need to be distributed across multiple servers</li>
                        <li style="margin-bottom: 10px;">Applications must scale up/down based on demand</li>
                        <li style="margin-bottom: 10px;">Failed containers need automatic restart</li>
                        <li style="margin-bottom: 10px;">Updates must happen without downtime</li>
                        <li style="margin-bottom: 10px;">Networking between containers must be managed</li>
                    </ul>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                        <strong>Core Orchestration Features</strong>
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4a90e2;">📅 Scheduling</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Decides which node runs which container based on resources and constraints</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4a90e2;">📈 Scaling</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Automatically adds or removes containers to match demand</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4a90e2;">💚 Healing</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Detects failures and restarts containers automatically</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                            <strong style="color: #4a90e2;">🔄 Rollouts</strong>
                            <p style="margin: 8px 0 0 0; font-size: 14px;">Updates applications gradually without downtime</p>
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(244, 67, 54, 0.1); border-radius: 8px; border-left: 4px solid #f44336;">
                    <p style="font-size: 18px; color: #f44336; margin-bottom: 15px;">
                        <strong>🔄 Self-Healing Example</strong>
                    </p>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <span style="color: #4caf50;">✓</span>
                            <span>Pod running normally</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <span style="color: #f44336;">✗</span>
                            <span>Pod crashes or becomes unhealthy</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                            <span style="color: #ffc107;">⚡</span>
                            <span>Orchestrator detects failure</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span style="color: #4caf50;">✓</span>
                            <span>Orchestrator automatically creates new pod</span>
                        </div>
                    </div>
                    <p style="margin-top: 15px; font-size: 14px; color: #aaa;">
                        This happens automatically - no manual intervention needed!
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid #4caf50;">
                    <p style="font-size: 18px; color: #4caf50; margin-bottom: 15px;">
                        <strong>Kubernetes as an Orchestrator</strong>
                    </p>
                    <p>
                        Kubernetes is the most popular container orchestrator. It provides all these features out of the box, 
                        making it the industry standard for running containerized applications in production.
                    </p>
                </div>
            `
        };

        return EducationalSceneBase.create(engine, config);
    }
}

