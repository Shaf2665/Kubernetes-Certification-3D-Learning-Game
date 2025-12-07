import * as THREE from 'three';

/**
 * Simple camera controller for 3D navigation
 */
export class CameraController {
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.rotationSpeed = 0.005;
        this.zoomSpeed = 0.1;
        this.minDistance = 10;
        this.maxDistance = 50;
        this.distance = 20;
        this.angleX = 0;
        this.angleY = Math.PI / 4;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCameraPosition();
    }

    setupEventListeners() {
        if (!this.canvas) return;
        
        // Mouse drag for rotation
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left mouse button
                this.isDragging = true;
                this.previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.previousMousePosition.x;
                const deltaY = e.clientY - this.previousMousePosition.y;
                
                this.angleY += deltaX * this.rotationSpeed;
                this.angleX += deltaY * this.rotationSpeed;
                
                // Limit vertical rotation
                this.angleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.angleX));
                
                this.updateCameraPosition();
                this.previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // Mouse wheel for zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.distance += e.deltaY * this.zoomSpeed;
            this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance));
            this.updateCameraPosition();
        });
    }

    updateCameraPosition() {
        const x = Math.sin(this.angleY) * Math.cos(this.angleX) * this.distance;
        const y = Math.sin(this.angleX) * this.distance + 5;
        const z = Math.cos(this.angleY) * Math.cos(this.angleX) * this.distance;
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0, 0);
    }

    update(delta) {
        // Smooth camera movement if needed
    }

    reset() {
        this.angleX = Math.PI / 4;
        this.angleY = Math.PI / 4;
        this.distance = 20;
        this.updateCameraPosition();
    }
}

