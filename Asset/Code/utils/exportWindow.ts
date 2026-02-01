/**
 * Manages a popup window for displaying export content during recording
 */
class ExportWindowManager {
    private window: Window | null = null;
    private aspectRatio: 'horizontal' | 'vertical' = 'horizontal';

    open(content: string, aspectRatio: 'horizontal' | 'vertical' = 'horizontal'): void {
        this.aspectRatio = aspectRatio;

        if (this.window && !this.window.closed) {
            this.resize(aspectRatio);
            this.update(content);
            return;
        }

        // Calculate dimensions based on aspect ratio
        const { width, height } = this.getDimensions(aspectRatio);

        // Open a new popup window
        this.window = window.open(
            '',
            'RecordingView',
            `width=${width},height=${height},menubar=no,toolbar=no,location=no,status=no`
        );

        if (!this.window) {
            console.error('Failed to open export window');
            return;
        }

        // Write the initial HTML
        this.window.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Recording View</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                        background: #FFFFFF;
                        padding: 60px 80px;
                        overflow-y: auto;
                        height: 100vh;
                    }
                    #content {
                        font-size: 30px;
                        line-height: 1.6;
                        color: #000000;
                    }
                    p {
                        margin-bottom: 24px;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }
                </style>
            </head>
            <body>
                <div id="content"></div>
            </body>
            </html>
        `);
        this.window.document.close();

        this.update(content);
    }

    update(content: string): void {
        if (!this.window || this.window.closed) return;

        const contentDiv = this.window.document.getElementById('content');
        if (!contentDiv) return;

        // Update content
        contentDiv.innerHTML = content
            .split('\n')
            .map(line => `<p>${line || '&nbsp;'}</p>`)
            .join('');
    }

    close(): void {
        if (this.window && !this.window.closed) {
            this.window.close();
        }
        this.window = null;
    }

    private getDimensions(aspectRatio: 'horizontal' | 'vertical'): { width: number; height: number } {
        if (aspectRatio === 'vertical') {
            return { width: 1080, height: 1920 }; // 9:16 for vertical videos
        }
        return { width: 1920, height: 1080 }; // 16:9 for horizontal videos
    }

    private resize(aspectRatio: 'horizontal' | 'vertical'): void {
        if (!this.window || this.window.closed) return;

        const { width, height } = this.getDimensions(aspectRatio);
        this.window.resizeTo(width, height);

        // Update the body dimensions in the window
        const body = this.window.document.body;
        if (body) {
            body.style.width = `${width}px`;
            body.style.height = `${height}px`;
        }
    }
}

export const exportWindowManager = new ExportWindowManager();
