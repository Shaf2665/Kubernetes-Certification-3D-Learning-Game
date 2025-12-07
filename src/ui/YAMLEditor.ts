/**
 * Lightweight YAML editor component with syntax validation
 */
export class YAMLEditor {
    private container: HTMLElement;
    private textarea!: HTMLTextAreaElement;
    private errorDisplay!: HTMLElement;
    private onValidate?: (isValid: boolean, errors: string[]) => void;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
        this.container = container;
        this.createEditor();
    }

    private createEditor(): void {
        this.container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                gap: 10px;
            ">
                <textarea 
                    id="yaml-editor-textarea"
                    style="
                        width: 100%;
                        min-height: 300px;
                        background: #1e1e1e;
                        color: #d4d4d4;
                        border: 1px solid #3e3e3e;
                        border-radius: 5px;
                        padding: 15px;
                        font-family: 'Courier New', monospace;
                        font-size: 14px;
                        line-height: 1.6;
                        resize: vertical;
                        tab-size: 2;
                    "
                    spellcheck="false"
                ></textarea>
                <div id="yaml-editor-errors" style="
                    min-height: 50px;
                    padding: 10px;
                    background: rgba(244, 67, 54, 0.1);
                    border: 1px solid #f44336;
                    border-radius: 5px;
                    color: #f44336;
                    font-size: 13px;
                    display: none;
                "></div>
                <div id="yaml-editor-success" style="
                    padding: 10px;
                    background: rgba(76, 175, 80, 0.1);
                    border: 1px solid #4caf50;
                    border-radius: 5px;
                    color: #4caf50;
                    font-size: 13px;
                    display: none;
                ">✓ Valid YAML</div>
            </div>
        `;

        this.textarea = document.getElementById('yaml-editor-textarea') as HTMLTextAreaElement;
        this.errorDisplay = document.getElementById('yaml-editor-errors')!;

        // Add input listener for real-time validation
        this.textarea.addEventListener('input', () => {
            this.validate();
        });

        // Add tab support
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.textarea.selectionStart;
                const end = this.textarea.selectionEnd;
                this.textarea.value = this.textarea.value.substring(0, start) + '  ' + this.textarea.value.substring(end);
                this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
            }
        });
    }

    getValue(): string {
        return this.textarea.value;
    }

    setValue(value: string): void {
        this.textarea.value = value;
        this.validate();
    }

    setOnValidate(callback: (isValid: boolean, errors: string[]) => void): void {
        this.onValidate = callback;
    }

    validate(): boolean {
        const yaml = this.textarea.value.trim();
        const errors: string[] = [];

        const successDisplay = document.getElementById('yaml-editor-success')!;
        
        if (!yaml) {
            this.errorDisplay.style.display = 'none';
            successDisplay.style.display = 'none';
            if (this.onValidate) {
                this.onValidate(true, []);
            }
            return true;
        }

        // Basic YAML validation
        const lines = yaml.split('\n');
        let indentStack: number[] = [0];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNum = i + 1;
            
            // Skip empty lines and comments
            if (line.trim() === '' || line.trim().startsWith('#')) {
                continue;
            }

            // Check for tabs (should use spaces)
            if (line.includes('\t')) {
                errors.push(`Line ${lineNum}: Tabs are not allowed. Use spaces for indentation.`);
            }

            // Check indentation consistency
            const indent = line.match(/^(\s*)/)?.[1].length || 0;
            const prevIndent = indentStack[indentStack.length - 1];
            
            // Check for inconsistent indentation (more than 2 spaces difference)
            if (indent > prevIndent + 2) {
                errors.push(`Line ${lineNum}: Indentation increased by more than 2 spaces. Use consistent 2-space indentation.`);
            }

            // Check for key-value pairs
            if (line.includes(':')) {
                const parts = line.split(':');
                if (parts.length > 2) {
                    errors.push(`Line ${lineNum}: Multiple colons found. Use quotes if the value contains a colon.`);
                }
                if (parts[1] && parts[1].trim() === '') {
                    // This is a parent key, update indent stack
                    indentStack.push(indent);
                }
            }

            // Check for common mistakes
            if (line.trim().endsWith(':') && !line.trim().startsWith('-')) {
                // Parent key - should be followed by indented content
                if (i < lines.length - 1) {
                    const nextLine = lines[i + 1];
                    if (nextLine.trim() !== '' && !nextLine.trim().startsWith('#')) {
                        const nextIndent = nextLine.match(/^(\s*)/)?.[1].length || 0;
                        if (nextIndent <= indent) {
                            errors.push(`Line ${lineNum}: Key "${line.trim()}" should be followed by indented content.`);
                        }
                    }
                }
            }
        }

        // Display results
        if (errors.length > 0) {
            this.errorDisplay.innerHTML = `<strong>Errors found:</strong><ul style="margin: 10px 0 0 20px; padding: 0;">${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
            this.errorDisplay.style.display = 'block';
            successDisplay.style.display = 'none';
        } else {
            this.errorDisplay.style.display = 'none';
            successDisplay.style.display = 'block';
        }

        if (this.onValidate) {
            this.onValidate(errors.length === 0, errors);
        }

        return errors.length === 0;
    }

    clear(): void {
        this.textarea.value = '';
        this.errorDisplay.style.display = 'none';
        const successDisplay = document.getElementById('yaml-editor-success')!;
        successDisplay.style.display = 'none';
    }
}

