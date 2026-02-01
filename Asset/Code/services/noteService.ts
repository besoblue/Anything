import { db } from './database';
import type { Note, Folder, NoteListItem } from '../types/note';
import { v4 as uuidv4 } from 'uuid';
import { MAX_TITLE_LENGTH } from '../constants/app';

// Input validation constants
const MAX_CONTENT_LENGTH = 1000000; // 1 million characters
const MAX_FOLDER_NAME_LENGTH = 100;
const MAX_SEARCH_QUERY_LENGTH = 500;

// Database row type definitions
interface NoteRow {
    id: string;
    title: string;
    content: string;
    folder_id: string | null;
    created_at: number;
    modified_at: number;
    archived: number;
}

interface FolderRow {
    id: string;
    name: string;
    color: string | null;
    created_at: number;
}

// Helper functions to map database rows to domain objects (DRY fix)
const mapRowToNote = (row: NoteRow): Note => ({
    id: row.id,
    title: row.title,
    content: row.content,
    folderId: row.folder_id,
    createdAt: row.created_at,
    modifiedAt: row.modified_at,
    archived: Boolean(row.archived),
});

const mapRowToFolder = (row: FolderRow): Folder => ({
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
});

export const noteService = {
    // Create a new note
    createNote(title: string, content: string, folderId: string | null = null): Note {
        // Input validation
        const validatedTitle = title.substring(0, MAX_TITLE_LENGTH);
        const validatedContent = content.substring(0, MAX_CONTENT_LENGTH);

        const now = Date.now();
        const note: Note = {
            id: uuidv4(),
            title: validatedTitle,
            content: validatedContent,
            folderId,
            createdAt: now,
            modifiedAt: now,
            archived: false,
        };

        db.run(
            `INSERT INTO notes (id, title, content, folder_id, created_at, modified_at, archived)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [note.id, note.title, note.content, note.folderId, note.createdAt, note.modifiedAt, 0]
        );

        return note;
    },

    // Update an existing note
    updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): void {
        // Input validation
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid note ID');
        }

        const now = Date.now();
        const fields: string[] = [];
        const values: (string | number | null)[] = [];

        if (updates.title !== undefined) {
            fields.push('title = ?');
            values.push(updates.title.substring(0, MAX_TITLE_LENGTH));
        }
        if (updates.content !== undefined) {
            fields.push('content = ?');
            values.push(updates.content.substring(0, MAX_CONTENT_LENGTH));
        }
        if (updates.folderId !== undefined) {
            fields.push('folder_id = ?');
            values.push(updates.folderId);
        }
        if (updates.archived !== undefined) {
            fields.push('archived = ?');
            values.push(updates.archived ? 1 : 0);
        }

        fields.push('modified_at = ?');
        values.push(now);
        values.push(id);

        db.run(
            `UPDATE notes SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
    },

    // Get a single note by ID
    getNote(id: string): Note | null {
        const results = db.execute<NoteRow>(
            'SELECT * FROM notes WHERE id = ?',
            [id]
        );

        if (results.length === 0) return null;

        return mapRowToNote(results[0]);
    },

    // Get all notes (excluding archived)
    getAllNotes(includeArchived = false): Note[] {
        const sql = includeArchived
            ? 'SELECT * FROM notes ORDER BY modified_at DESC'
            : 'SELECT * FROM notes WHERE archived = 0 ORDER BY modified_at DESC';

        const results = db.execute<NoteRow>(sql);

        return results.map(mapRowToNote);
    },

    // Get notes by folder
    getNotesByFolder(folderId: string | null): Note[] {
        const sql = folderId
            ? 'SELECT * FROM notes WHERE folder_id = ? AND archived = 0 ORDER BY modified_at DESC'
            : 'SELECT * FROM notes WHERE folder_id IS NULL AND archived = 0 ORDER BY modified_at DESC';

        const results = db.execute<NoteRow>(sql, folderId ? [folderId] : []);

        return results.map(mapRowToNote);
    },

    // Search notes
    searchNotes(query: string): NoteListItem[] {
        // Input validation and sanitization
        const validatedQuery = query.substring(0, MAX_SEARCH_QUERY_LENGTH).trim();
        if (!validatedQuery) {
            return [];
        }

        const searchTerm = `%${validatedQuery}%`;
        const results = db.execute<NoteRow>(
            `SELECT id, title, content, modified_at, folder_id
       FROM notes
       WHERE (title LIKE ? OR content LIKE ?) AND archived = 0
       ORDER BY modified_at DESC`,
            [searchTerm, searchTerm]
        );

        return results.map((row) => ({
            id: row.id,
            title: row.title,
            preview: row.content.substring(0, 100),
            modifiedAt: row.modified_at,
            folderId: row.folder_id,
        }));
    },

    // Delete a note
    deleteNote(id: string): void {
        // Input validation
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid note ID');
        }

        db.run('DELETE FROM notes WHERE id = ?', [id]);
        // Also delete associated recordings
        db.run('DELETE FROM recordings WHERE note_id = ?', [id]);
    },

    // Delete multiple notes
    deleteNotes(ids: string[]): void {
        // Input validation
        if (!Array.isArray(ids) || ids.length === 0) return;

        // Filter out invalid IDs
        const validIds = ids.filter(id => id && typeof id === 'string');
        if (validIds.length === 0) return;

        const placeholders = validIds.map(() => '?').join(',');
        db.run(`DELETE FROM notes WHERE id IN (${placeholders})`, validIds);
        db.run(`DELETE FROM recordings WHERE note_id IN (${placeholders})`, validIds);
    },

    // Archive/unarchive a note
    archiveNote(id: string, archived: boolean): void {
        db.run('UPDATE notes SET archived = ? WHERE id = ?', [archived ? 1 : 0, id]);
    },

    // Folder operations
    createFolder(name: string, color: string | null = null): Folder {
        // Input validation
        const validatedName = name.trim().substring(0, MAX_FOLDER_NAME_LENGTH);
        if (!validatedName) {
            throw new Error('Folder name cannot be empty');
        }

        const folder: Folder = {
            id: uuidv4(),
            name: validatedName,
            color,
            createdAt: Date.now(),
        };

        db.run(
            'INSERT INTO folders (id, name, color, created_at) VALUES (?, ?, ?, ?)',
            [folder.id, folder.name, folder.color, folder.createdAt]
        );

        return folder;
    },

    getAllFolders(): Folder[] {
        const results = db.execute<FolderRow>('SELECT * FROM folders ORDER BY name ASC');

        return results.map(mapRowToFolder);
    },

    updateFolder(id: string, name: string, color: string | null): void {
        // Input validation
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid folder ID');
        }

        const validatedName = name.trim().substring(0, MAX_FOLDER_NAME_LENGTH);
        if (!validatedName) {
            throw new Error('Folder name cannot be empty');
        }

        db.run('UPDATE folders SET name = ?, color = ? WHERE id = ?', [validatedName, color, id]);
    },

    deleteFolder(id: string): void {
        // Input validation
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid folder ID');
        }

        // Move notes in this folder to no folder
        db.run('UPDATE notes SET folder_id = NULL WHERE folder_id = ?', [id]);
        db.run('DELETE FROM folders WHERE id = ?', [id]);
    },
};
