import type { Database } from 'sql.js';

export interface DatabaseSchema {
    notes: {
        id: string;
        title: string;
        content: string;
        folder_id: string | null;
        created_at: number;
        modified_at: number;
        archived: number; // SQLite uses 0/1 for boolean
    };
    folders: {
        id: string;
        name: string;
        color: string | null;
        created_at: number;
    };
    recordings: {
        id: string;
        note_id: string;
        duration: number;
        file_path: string;
        has_audio: number; // SQLite uses 0/1 for boolean
        language: string | null;
        created_at: number;
    };
    settings: {
        key: string;
        value: string;
    };
}

export interface DatabaseService {
    db: Database | null;
    initialize: () => Promise<void>;
    execute: (sql: string, params?: any[]) => any[];
    run: (sql: string, params?: any[]) => void;
    close: () => void;
    export: () => Uint8Array;
}

export type QueryResult<T> = T[];
