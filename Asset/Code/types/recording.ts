export interface Recording {
    id: string;
    noteId: string;
    duration: number;
    filePath: string;
    hasAudio: boolean;
    language: 'chinese' | 'english' | 'both' | null;
    createdAt: number;
}

export type RecordingState = 'idle' | 'recording' | 'paused' | 'processing';

export interface ExportOptions {
    format: 'mp4' | 'webm';
    quality: 'high' | 'medium' | 'low';
    aspectRatio: 'vertical' | 'horizontal';
    includeAudio: boolean;
}

export interface RecordingConfig {
    maxDuration: number; // in seconds
    videoBitsPerSecond?: number;
    audioBitsPerSecond?: number;
    mimeType?: string;
}
