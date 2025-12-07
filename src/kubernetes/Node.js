import * as THREE from 'three';

/**
 * 3D representation of a Kubernetes Node
 */
export class Node {
    constructor(name, position) {
        this.name = name;
        this.pods = [];
        this.position = position;
        this.mesh = this.createMesh();
        this.container = new THREE.Group();
        this.container.name = `node-${name}`;
        this.container.position.set(position.x, position.y, position.z);
        this.container.add(this.mesh);
        
        // Add label
        this.addLabel();
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x4a90e2,
            metalness: 0.7,
            roughness: 0.3,
            emissive: 0x1a3a5a,
            emissiveIntensity: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    addLabel() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(this.name, canvas.width / 2, canvas.height / 2 + 8);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.y = 1.5;
        sprite.scale.set(2, 0.5, 1);
        this.container.add(sprite);
    }

    addPod(pod) {
        this.pods.push(pod);
        const index = this.pods.length - 1;
        const angle = (index / Math.max(1, this.pods.length)) * Math.PI * 2;
        const radius = 1.5;
        pod.container.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius + 1.2,
            0
        );
        this.container.add(pod.container);
    }

    removePod(pod) {
        const index = this.pods.indexOf(pod);
        if (index > -1) {
            this.pods.splice(index, 1);
            this.container.remove(pod.container);
            // Reposition remaining pods
            this.pods.forEach((p, i) => {
                const angle = (i / Math.max(1, this.pods.length)) * Math.PI * 2;
                const radius = 1.5;
                p.container.position.set(
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius + 1.2,
                    0
                );
            });
        }
    }

    getPodCount() {
        return this.pods.length;
    }

    animate(delta) {
        // Subtle rotation
        this.container.rotation.y += delta * 0.2;
    }

    dispose() {
        this.pods.forEach(pod => pod.dispose());
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        if (this.container.parent) {
            this.container.parent.remove(this.container);
        }
    }
}

