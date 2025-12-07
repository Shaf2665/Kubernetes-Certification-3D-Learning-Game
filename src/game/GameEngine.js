import * as THREE from 'three';

/**
 * Core 3D game engine using Three.js
 */
export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x1a1a2e, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
        
        // Camera position
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);
        
        // Controls
        this.controls = null; // Will be set by CameraController
        
        // Update callback
        this.updateCallback = null;
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    animate() {
        requestAnimationFrame(this.animate);
        
        const delta = this.clock.getDelta();
        
        // Update controls if available
        if (this.controls && this.controls.update) {
            this.controls.update(delta);
        }
        
        // Call update callback
        if (this.updateCallback) {
            this.updateCallback(delta);
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.animate();
    }

    stop() {
        // Stop animation loop if needed
        cancelAnimationFrame(this.animate);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setUpdateCallback(callback) {
        this.updateCallback = callback;
    }

    setControls(controls) {
        this.controls = controls;
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }
}

