/**
 * Dialog box component for displaying messages
 */
export class DialogBox {
    private container: HTMLElement | null = null;

    constructor() {
        this.container = document.getElementById('dialog-box');
    }

    show(title: string, message: string, onClose?: () => void): void {
        if (!this.container) return;

        // Remove old event listeners by cloning the element
        const oldContainer = this.container;
        const newContainer = oldContainer.cloneNode(false) as HTMLElement;
        oldContainer.parentNode?.replaceChild(newContainer, oldContainer);
        this.container = newContainer;

        this.container.innerHTML = `
            <h2 style="color: #4a90e2; margin-bottom: 15px;">${title}</h2>
            <p style="margin-bottom: 20px; line-height: 1.6;">${message}</p>
            <button id="dialog-close" style="
                background: #4a90e2;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            ">Close</button>
        `;
        this.container.style.display = 'block';

        const closeBtn = this.container.querySelector('#dialog-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
                if (onClose) onClose();
            });
        }
    }

    hide(): void {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
}

