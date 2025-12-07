import * as THREE from 'three';

/**
 * Manages the 3D scene setup, lighting, and environment
 */
export class SceneManager {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.scene = gameEngine.scene;
        this.setupLights();
        this.setupEnvironment();
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 15, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
        fillLight.position.set(-10, 5, -10);
        this.scene.add(fillLight);

        // Point light for highlights
        const pointLight = new THREE.PointLight(0x4a90e2, 0.5, 30);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);
    }

    setupEnvironment() {
        // Add grid helper
        const gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x222222);
        gridHelper.position.y = 0;
        this.scene.add(gridHelper);

        // Add axes helper (optional, for debugging)
        // const axesHelper = new THREE.AxesHelper(10);
        // this.scene.add(axesHelper);

        // Add subtle fog for depth
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
    }

    addToScene(object) {
        this.scene.add(object);
    }

    removeFromScene(object) {
        this.scene.remove(object);
    }

    clearScene() {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        // Re-add lights and environment
        this.setupLights();
        this.setupEnvironment();
    }
}

