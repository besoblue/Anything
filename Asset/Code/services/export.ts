import { Note } from '../types/note';
import { downloadFile, formatFilenameDate, sanitizeFilename } from '../utils/file';

export interface ExportOptions {
    format: 'mp4' | 'webm' | 'md' | 'txt';
    aspectRatio?: 'vertical' | 'horizontal';
    quality?: 'high' | 'medium' | 'low';
    filename?: string;
}

export class ExportService {
    private versionCounts: Map<string, number> = new Map();

    /**
     * Exports a note as Markdown or Plain Text.
     */
    exportNote(note: Note, format: 'md' | 'txt'): void {
        const noteTitle = sanitizeFilename(note.title || 'Untitled');
        const version = this.getNextVersion(noteTitle);
        const defaultFilename = `${noteTitle}.v${version}.${format}`;
        const blob = new Blob([note.content], { type: 'text/plain' });
        downloadFile(blob, defaultFilename);
    }

    /**
     * Exports a recording blob with specified options.
     * Note: Browser MediaRecorder produces WebM files.
     * MP4 format will use .mp4 extension but contains WebM/H.264 which is compatible with most players.
     */
    exportRecording(blob: Blob, options: ExportOptions): void {
        const ext = options.format === 'mp4' ? 'mp4' : 'webm';
        const baseFilename = options.filename ? sanitizeFilename(options.filename) : 'Recording';
        const version = this.getNextVersion(baseFilename);
        const filename = `${baseFilename}.v${version}.${ext}`;

        // Create a new blob with appropriate MIME type
        const mimeType = options.format === 'mp4' ? 'video/mp4' : 'video/webm';
        const properBlob = new Blob([blob], { type: mimeType });

        downloadFile(properBlob, filename);
    }

    /**
     * Generates a default filename for a note.
     */
    getDefaultFilename(note: Note | null): string {
        if (!note) return 'Note';
        return sanitizeFilename(note.title || 'Untitled');
    }

    /**
     * Gets the next version number for a given filename base.
     */
    private getNextVersion(filenameBase: string): number {
        const currentVersion = this.versionCounts.get(filenameBase) || 0;
        const nextVersion = currentVersion + 1;
        this.versionCounts.set(filenameBase, nextVersion);
        return nextVersion;
    }
}

export const exportService = new ExportService();
