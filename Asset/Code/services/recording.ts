import { chunkStorage } from '../utils/chunkStorage';

export class RecordingService {
    private mediaRecorder: MediaRecorder | null = null;
    private stream: MediaStream | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private animationFrameId: number | null = null;

    async startRecording(withAudio: boolean = true): Promise<void> {
        try {
            await chunkStorage.clear();

            // Find the editor container element (the main viewport without header)
            const editorContainer = document.querySelector('[class*="editorContainer"]') as HTMLElement;
            if (!editorContainer) {
                throw new Error('Editor container element not found');
            }

            // Create a canvas to capture the editor viewport
            this.canvas = document.createElement('canvas');
            // Get aspect ratio from the export view if it exists for settings
            const exportView = document.querySelector('[data-export-view="true"]') as HTMLElement;
            const aspectRatio = exportView?.getAttribute('data-aspect-ratio') || 'horizontal';

            // Set canvas dimensions based on aspect ratio
            if (aspectRatio === 'vertical') {
                this.canvas.width = 1080;
                this.canvas.height = 1920;
            } else {
                this.canvas.width = 1920;
                this.canvas.height = 1080;
            }

            const ctx = this.canvas.getContext('2d', { alpha: false });
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            // Function to draw the editor container to canvas
            const drawEditorToCanvas = async () => {
                if (!this.canvas || !editorContainer) return;

                // Get the actual dimensions of the editor container
                const rect = editorContainer.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;

                // Clear canvas with white background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Save context state
                ctx.save();

                // Scale to fit canvas
                ctx.scale(scaleX, scaleY);

                // Draw the entire editor container using a simpler approach
                // Get the textarea content
                const textarea = editorContainer.querySelector('textarea') as HTMLTextAreaElement;
                if (textarea) {
                    const content = textarea.value;
                    const lines = content.split('\n');

                    // Reset scale to draw text at correct size
                    ctx.restore();
                    ctx.save();

                    // Set font - larger size for better visibility in video
                    ctx.font = '60px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif';
                    ctx.fillStyle = '#000000';
                    ctx.textBaseline = 'top';

                    const padding = 80; // Equal top and left padding
                    let y = padding;
                    const lineHeight = 60 * 1.6 + 48; // Scale line spacing proportionally

                    lines.forEach((line) => {
                        const text = line || '\u00A0';
                        ctx.fillText(text, padding, y);
                        y += lineHeight;
                    });
                }

                ctx.restore();
            };

            // Start capturing frames at 30fps
            const captureFrame = async () => {
                await drawEditorToCanvas();
                this.animationFrameId = requestAnimationFrame(captureFrame);
            };

            captureFrame();

            // Get stream from canvas
            this.stream = this.canvas.captureStream(30); // 30 FPS

            if (withAudio) {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const tracks = [...this.stream.getVideoTracks(), ...audioStream.getAudioTracks()];
                    this.stream = new MediaStream(tracks);
                } catch (audioErr) {
                    console.warn('Microphone access denied, recording video only', audioErr);
                }
            }

            // Try to use H.264 codec which is compatible with QuickTime/MP4
            // Fall back to VP8 or VP9 if H.264 is not available
            let mimeType = 'video/webm;codecs=h264';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/webm;codecs=vp8';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'video/webm;codecs=vp9';
                }
            }

            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: mimeType,
            });

            this.mediaRecorder.ondataavailable = async (event) => {
                if (event.data.size > 0) {
                    await chunkStorage.addChunk(event.data);
                }
            };

            this.mediaRecorder.start(1000); // Collect chunks every second
            console.log(`Recording started with MediaRecorder using ${mimeType}`);
        } catch (error) {
            console.error('Failed to start recording:', error);
            throw error;
        }
    }

    async stopRecording(): Promise<Blob> {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) {
                reject(new Error('No recording in progress'));
                return;
            }

            this.mediaRecorder.onstop = async () => {
                const chunks = await chunkStorage.getAllChunks();
                const blob = new Blob(chunks, { type: 'video/webm' });
                this.cleanup();
                resolve(blob);
            };

            this.mediaRecorder.stop();
        });
    }

    private cleanup() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
            this.stream = null;
        }
        if (this.canvas) {
            this.canvas = null;
        }
        this.mediaRecorder = null;
    }
}

export const recordingService = new RecordingService();
