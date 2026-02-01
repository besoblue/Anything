import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/noteService';
import type { Note, Folder } from '../types/note';

export const useNotes = (isInitialized: boolean) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

    // Load all notes and folders
    const loadData = useCallback(() => {
        if (!isInitialized) return;

        try {
            const allNotes = noteService.getAllNotes();
            const allFolders = noteService.getAllFolders();
            setNotes(allNotes);
            setFolders(allFolders);
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    }, [isInitialized]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Create a new note
    const createNote = useCallback((title: string = 'Untitled', content: string = '') => {
        try {
            const newNote = noteService.createNote(title, content, selectedFolder);
            setNotes((prev) => [newNote, ...prev]);
            setCurrentNote(newNote);
            return newNote;
        } catch (error) {
            console.error('Failed to create note:', error);
            return null;
        }
    }, [selectedFolder]);

    // Update a note
    const updateNote = useCallback((id: string, updates: Partial<Note>) => {
        try {
            noteService.updateNote(id, updates);
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === id ? { ...note, ...updates, modifiedAt: Date.now() } : note
                )
            );
            if (currentNote?.id === id) {
                setCurrentNote((prev) => (prev ? { ...prev, ...updates, modifiedAt: Date.now() } : null));
            }
        } catch (error) {
            console.error('Failed to update note:', error);
        }
    }, [currentNote]);

    // Delete a note
    const deleteNote = useCallback((id: string) => {
        try {
            noteService.deleteNote(id);
            setNotes((prev) => prev.filter((note) => note.id !== id));
            if (currentNote?.id === id) {
                setCurrentNote(null);
            }
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    }, [currentNote]);

    // Delete multiple notes
    const deleteNotes = useCallback((ids: string[]) => {
        try {
            noteService.deleteNotes(ids);
            setNotes((prev) => prev.filter((note) => !ids.includes(note.id)));
            if (currentNote && ids.includes(currentNote.id)) {
                setCurrentNote(null);
            }
        } catch (error) {
            console.error('Failed to delete notes:', error);
        }
    }, [currentNote]);

    // Archive/unarchive a note
    const archiveNote = useCallback((id: string, archived: boolean) => {
        try {
            noteService.archiveNote(id, archived);
            setNotes((prev) =>
                prev.map((note) => (note.id === id ? { ...note, archived } : note))
            );
        } catch (error) {
            console.error('Failed to archive note:', error);
        }
    }, []);

    // Search notes
    const searchNotes = useCallback((query: string) => {
        try {
            return noteService.searchNotes(query);
        } catch (error) {
            console.error('Failed to search notes:', error);
            return [];
        }
    }, []);

    // Create a folder
    const createFolder = useCallback((name: string, color: string | null = null) => {
        try {
            const newFolder = noteService.createFolder(name, color);
            setFolders((prev) => [...prev, newFolder]);
            return newFolder;
        } catch (error) {
            console.error('Failed to create folder:', error);
            return null;
        }
    }, []);

    // Update a folder
    const updateFolder = useCallback((id: string, name: string, color: string | null) => {
        try {
            noteService.updateFolder(id, name, color);
            setFolders((prev) =>
                prev.map((folder) => (folder.id === id ? { ...folder, name, color } : folder))
            );
        } catch (error) {
            console.error('Failed to update folder:', error);
        }
    }, []);

    // Delete a folder
    const deleteFolder = useCallback((id: string) => {
        try {
            noteService.deleteFolder(id);
            setFolders((prev) => prev.filter((folder) => folder.id !== id));
            // Reload notes to reflect folder changes
            loadData();
        } catch (error) {
            console.error('Failed to delete folder:', error);
        }
    }, [loadData]);

    // Get notes for selected folder
    const getFilteredNotes = useCallback(() => {
        if (selectedFolder) {
            return notes.filter((note) => note.folderId === selectedFolder && !note.archived);
        }
        return notes.filter((note) => !note.archived);
    }, [notes, selectedFolder]);

    return {
        notes: getFilteredNotes(),
        allNotes: notes,
        folders,
        currentNote,
        selectedFolder,
        setCurrentNote,
        setSelectedFolder,
        createNote,
        updateNote,
        deleteNote,
        deleteNotes,
        archiveNote,
        searchNotes,
        createFolder,
        updateFolder,
        deleteFolder,
        loadData,
    };
};
