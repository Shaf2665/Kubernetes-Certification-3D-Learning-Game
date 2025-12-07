import { Engine, Scene } from '@babylonjs/core';
import { EducationalSceneBase, EducationalSceneConfig } from './base/EducationalSceneBase.js';

/**
 * Microservices Animation scene - Shows microservices architecture
 */
export class MicroservicesAnimationScene {
    static async create(engine: Engine): Promise<Scene> {
        const config: EducationalSceneConfig = {
            title: 'Microservices Architecture',
            moduleName: 'microservices',
            nextScene: 'fundamentals',
            showBackButton: true,
            content: `
                <div style="margin-bottom: 30px;">
                    <p style="font-size: 20px; color: #fff; margin-bottom: 15px;">
                        <strong>Building Microservices with Kubernetes</strong>
                    </p>
                    <p>
                        Kubernetes is perfect for microservices architectures. Each service can be independently deployed, 
                        scaled, and managed.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(74, 144, 226, 0.1); border-radius: 8px; border-left: 4px solid #4a90e2;">
                    <p style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">
                        <strong>🏗️ Typical Microservices Stack</strong>
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 10px;">🖥️</div>
                            <strong style="color: #4a90e2;">Frontend</strong>
                            <p style="margin: 8px 0 0 0; font-size: 12px;">User interface</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 10px;">🌐</div>
                            <strong style="color: #4a90e2;">API Gateway</strong>
                            <p style="margin: 8px 0 0 0; font-size: 12px;">Routes requests</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 10px;">⚙️</div>
                            <strong style="color: #4a90e2;">Backend</strong>
                            <p style="margin: 8px 0 0 0; font-size: 12px;">Business logic</p>
                        </div>
                        <div style="padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 10px;">💾</div>
                            <strong style="color: #4a90e2;">Database</strong>
                            <p style="margin: 8px 0 0 0; font-size: 12px;">Data storage</p>
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="font-size: 18px; color: #ffc107; margin-bottom: 15px;">
                        <strong>🔄 Traffic Flow</strong>
                    </p>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        <div style="text-align: center; font-size: 14px; color: #aaa; line-height: 2;">
                            <div style="margin-bottom: 10px;">
                                <strong style="color: #fff;">User</strong> → 
                                <span style="color: #888;">requests</span> → 
                                <strong style="color: #4a90e2;">Frontend Service</strong>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <strong style="color: #4a90e2;">Frontend</strong> → 
                                <span style="color: #888;">calls</span> → 
                                <strong style="color: #ffc107;">API Gateway</strong>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <strong style="color: #ffc107;">API Gateway</strong> → 
                                <span style="color: #888;">routes to</span> → 
                                <strong style="color: #4caf50;">Backend Service</strong>
                            </div>
                            <div>
                                <strong style="color: #4caf50;">Backend</strong> → 
                                <span style="color: #888;">queries</span> → 
                                <strong style="color: #9c27b0;">Database</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid #4caf50;">
                    <p style="font-size: 18px; color: #4caf50; margin-bottom: 15px;">
                        <strong>📈 Independent Scaling</strong>
                    </p>
                    <p style="margin-bottom: 15px;">
                        Each microservice can be scaled independently based on its own demand:
                    </p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;"><strong>Frontend:</strong> Scale based on user traffic</li>
                        <li style="margin-bottom: 10px;"><strong>Backend:</strong> Scale based on API requests</li>
                        <li style="margin-bottom: 10px;"><strong>Database:</strong> Usually stateful, may need different scaling strategy</li>
                    </ul>
                    <p style="margin-top: 15px; font-size: 14px; color: #aaa;">
                        Kubernetes Services route traffic to the correct number of Pods automatically.
                    </p>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(156, 39, 176, 0.1); border-radius: 8px; border-left: 4px solid #9c27b0;">
                    <p style="font-size: 18px; color: #9c27b0; margin-bottom: 15px;">
                        <strong>🔍 Service Discovery</strong>
                    </p>
                    <p style="margin-bottom: 15px;">
                        Services automatically discover each other using Kubernetes DNS:
                    </p>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.5); border-radius: 5px; font-family: 'Courier New', monospace; font-size: 14px; color: #00ff00;">
                        <span style="color: #aaa;"># Frontend calls backend</span><br>
                        <span style="color: #4a90e2;">http://backend-service:8080/api/data</span><br>
                        <br>
                        <span style="color: #aaa;"># Kubernetes DNS resolves to Service</span><br>
                        <span style="color: #aaa;"># Service routes to available Pods</span>
                    </div>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                    <p style="font-size: 18px; color: #fff; margin-bottom: 15px;">
                        <strong>✅ Benefits of Microservices on Kubernetes</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Independent deployment and scaling</li>
                        <li style="margin-bottom: 10px;">Fault isolation - one service failure doesn't bring down everything</li>
                        <li style="margin-bottom: 10px;">Technology diversity - each service can use different languages/frameworks</li>
                        <li style="margin-bottom: 10px;">Team autonomy - teams can work on different services independently</li>
                    </ul>
                </div>

                <div style="margin: 30px 0; padding: 20px; background: rgba(244, 67, 54, 0.1); border-radius: 8px; border-left: 4px solid #f44336;">
                    <p style="font-size: 18px; color: #f44336; margin-bottom: 15px;">
                        <strong>🎉 You're Ready!</strong>
                    </p>
                    <p>
                        You've completed the Learning Journey! You now understand the fundamentals of Kubernetes. 
                        It's time to put your knowledge into practice with hands-on missions.
                    </p>
                </div>
            `
        };

        return EducationalSceneBase.create(engine, config);
    }
}

