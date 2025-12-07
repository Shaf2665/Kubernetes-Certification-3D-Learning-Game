import * as THREE from 'three';

/**
 * Visual effects for resource creation/deletion
 */
export class VisualEffects {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    createParticleEffect(position, color = 0x00ff00, count = 20) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = position.x;
            positions[i3 + 1] = position.y;
            positions[i3 + 2] = position.z;
            
            velocities[i3] = (Math.random() - 0.5) * 2;
            velocities[i3 + 1] = Math.random() * 2;
            velocities[i3 + 2] = (Math.random() - 0.5) * 2;
            
            const r = (color >> 16) & 0xff;
            const g = (color >> 8) & 0xff;
            const b = color & 0xff;
            colors[i3] = r / 255;
            colors[i3 + 1] = g / 255;
            colors[i3 + 2] = b / 255;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 1
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData.velocities = velocities;
        particles.userData.lifetime = 1.0;
        particles.userData.maxLifetime = 1.0;
        
        this.scene.add(particles);
        this.particles.push(particles);
        
        return particles;
    }

    createCreationEffect(position) {
        return this.createParticleEffect(position, 0x00ff00, 30);
    }

    createDeletionEffect(position) {
        return this.createParticleEffect(position, 0xff0000, 30);
    }

    update(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const velocities = particle.userData.velocities;
            const positions = particle.geometry.attributes.position.array;
            
            particle.userData.lifetime -= delta;
            
            if (particle.userData.lifetime <= 0) {
                this.scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
                this.particles.splice(i, 1);
                continue;
            }
            
            // Update positions
            for (let j = 0; j < positions.length; j += 3) {
                positions[j] += velocities[j] * delta * 2;
                positions[j + 1] += velocities[j + 1] * delta * 2;
                positions[j + 2] += velocities[j + 2] * delta * 2;
                
                // Gravity
                velocities[j + 1] -= 9.8 * delta;
            }
            
            particle.geometry.attributes.position.needsUpdate = true;
            
            // Fade out
            const opacity = particle.userData.lifetime / particle.userData.maxLifetime;
            particle.material.opacity = opacity;
        }
    }

    createPulseEffect(object, color = 0xffff00) {
        const originalEmissive = object.material.emissive.getHex();
        const originalIntensity = object.material.emissiveIntensity;
        
        let pulseTime = 0;
        const pulseDuration = 1.0;
        
        const pulse = () => {
            pulseTime += 0.05;
            if (pulseTime >= pulseDuration) {
                object.material.emissive.setHex(originalEmissive);
                object.material.emissiveIntensity = originalIntensity;
                return;
            }
            
            const intensity = 0.5 + Math.sin(pulseTime * Math.PI * 2) * 0.5;
            object.material.emissive.setHex(color);
            object.material.emissiveIntensity = intensity;
            
            requestAnimationFrame(pulse);
        };
        
        pulse();
    }
}

