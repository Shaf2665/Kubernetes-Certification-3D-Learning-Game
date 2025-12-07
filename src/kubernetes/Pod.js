import * as THREE from 'three';

/**
 * 3D representation of a Kubernetes Pod
 */
export class Pod {
    constructor(name, node, color = 0x00ff00) {
        this.name = name;
        this.node = node;
        this.status = 'Pending';
        this.color = color;
        this.mesh = this.createMesh();
        this.container = new THREE.Group();
        this.container.name = `pod-${name}`;
        this.container.add(this.mesh);
        
        // Add label
        this.addLabel();
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const material = new THREE.MeshPhongMaterial({ 
            color: this.color,
            emissive: this.color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    addLabel() {
        // Create a simple text label using a sprite or canvas texture
        // For now, we'll use a simple approach
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(this.name, canvas.width / 2, canvas.height / 2 + 8);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.y = 0.6;
        sprite.scale.set(1, 0.25, 1);
        this.container.add(sprite);
    }

    updateStatus(status) {
        this.status = status;
        const colorMap = {
            'Running': 0x00ff00,
            'Pending': 0xffff00,
            'Failed': 0xff0000,
            'Terminating': 0xff8800,
            'Succeeded': 0x00ffff
        };
        const newColor = colorMap[status] || 0xffffff;
        this.mesh.material.color.setHex(newColor);
        this.mesh.material.emissive.setHex(newColor);
    }

    getPosition() {
        return this.container.position;
    }

    animate(delta) {
        // Subtle floating animation
        this.container.rotation.y += delta * 0.5;
        this.container.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }

    dispose() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        // Remove from parent
        if (this.container.parent) {
            this.container.parent.remove(this.container);
        }
    }
}

