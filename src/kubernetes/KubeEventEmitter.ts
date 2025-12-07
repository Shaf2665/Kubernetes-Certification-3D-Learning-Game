/**
 * Simple event emitter for Kubernetes cluster events
 */
class EventEmitter {
    private listeners: Map<string, Array<(data: any) => void>> = new Map();

    on(event: string, callback: (data: any) => void): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    off(event: string, callback: (data: any) => void): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event: string, data?: any): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`[KubeEventEmitter] Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    removeAllListeners(event?: string): void {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }
}

export const kubeEvents = new EventEmitter();

