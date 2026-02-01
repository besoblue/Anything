import initSqlJs, { Database } from 'sql.js';

class DatabaseService {
    private db: Database | null = null;
    private static instance: DatabaseService;

    private constructor() { }

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    async initialize(): Promise<void> {
        try {
            const SQL = await initSqlJs({
                locateFile: (file) => `https://sql.js.org/dist/${file}`,
            });

            // Try to load existing database from localStorage
            const savedDb = localStorage.getItem('noteapp_database');
            if (savedDb) {
                const uint8Array = new Uint8Array(JSON.parse(savedDb));
                this.db = new SQL.Database(uint8Array);
            } else {
                this.db = new SQL.Database();
                this.createSchema();
            }

            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    private createSchema(): void {
        if (!this.db) throw new Error('Database not initialized');

        // Create notes table
        this.db.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        folder_id TEXT,
        created_at INTEGER NOT NULL,
        modified_at INTEGER NOT NULL,
        archived INTEGER DEFAULT 0,
        FOREIGN KEY (folder_id) REFERENCES folders(id)
      )
    `);

        // Create folders table
        this.db.run(`
      CREATE TABLE IF NOT EXISTS folders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT,
        created_at INTEGER NOT NULL
      )
    `);

        // Create recordings table
        this.db.run(`
      CREATE TABLE IF NOT EXISTS recordings (
        id TEXT PRIMARY KEY,
        note_id TEXT NOT NULL,
        duration INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        has_audio INTEGER DEFAULT 0,
        language TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (note_id) REFERENCES notes(id)
      )
    `);

        // Create settings table
        this.db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

        // Create indexes for better performance
        this.db.run('CREATE INDEX IF NOT EXISTS idx_notes_folder ON notes(folder_id)');
        this.db.run('CREATE INDEX IF NOT EXISTS idx_notes_modified ON notes(modified_at DESC)');
        this.db.run('CREATE INDEX IF NOT EXISTS idx_recordings_note ON recordings(note_id)');

        this.save();
    }

    execute<T = any>(sql: string, params: any[] = []): T[] {
        if (!this.db) throw new Error('Database not initialized');

        const results: T[] = [];
        const stmt = this.db.prepare(sql);
        stmt.bind(params);

        while (stmt.step()) {
            results.push(stmt.getAsObject() as T);
        }
        stmt.free();

        return results;
    }

    run(sql: string, params: any[] = []): void {
        if (!this.db) throw new Error('Database not initialized');
        this.db.run(sql, params);
        this.save();
    }

    save(): void {
        if (!this.db) return;

        try {
            const data = this.db.export();
            const buffer = Array.from(data);
            const serialized = JSON.stringify(buffer);

            // Check approximate size (2 bytes per character in UTF-16)
            const sizeInBytes = serialized.length * 2;
            const sizeInMB = sizeInBytes / (1024 * 1024);

            if (sizeInMB > 4) {
                console.warn(`Database size (${sizeInMB.toFixed(2)}MB) is approaching localStorage limits`);
            }

            localStorage.setItem('noteapp_database', serialized);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.error('Storage quota exceeded. Database could not be saved.');
                // Notify user through UI (could emit an event or use a global error handler)
                throw new Error('Storage quota exceeded. Please delete some notes or export your data.');
            } else {
                console.error('Failed to save database:', error);
                throw error;
            }
        }
    }

    export(): Uint8Array {
        if (!this.db) throw new Error('Database not initialized');
        return this.db.export();
    }

    close(): void {
        if (this.db) {
            this.save();
            this.db.close();
            this.db = null;
        }
    }
}

export const db = DatabaseService.getInstance();
