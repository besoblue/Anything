import React, { useState, useMemo } from 'react';
import { Folder as FolderIcon } from 'lucide-react';
import { SearchBar } from '../shared';
import { formatRelativeTime } from '../../utils/date';
import type { Note, Folder } from '../../types/note';
import styles from './Sidebar.module.css';

interface SidebarProps {
    notes: Note[];
    folders: Folder[];
    selectedNoteIds: string[];
    selectedFolder: string | null;
    onSelectNote: (note: Note, multiSelect?: boolean, rangeSelect?: boolean) => void;
    onSelectFolder: (folderId: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    notes,
    folders,
    selectedNoteIds,
    selectedFolder,
    onSelectNote,
    onSelectFolder,
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Memoize filtered notes to prevent unnecessary recalculations
    const filteredNotes = useMemo(() => {
        // Filter out empty notes (notes with no content)
        const notesWithContent = notes.filter(note => note.content.trim() !== '');

        if (!searchQuery) return notesWithContent;

        const lowerQuery = searchQuery.toLowerCase();
        return notesWithContent.filter(
            (note) =>
                note.title.toLowerCase().includes(lowerQuery) ||
                note.content.toLowerCase().includes(lowerQuery)
        );
    }, [notes, searchQuery]);

    // Memoize folder note counts for better performance
    const folderCounts = useMemo(() => {
        const counts = new Map<string, number>();
        notes.forEach(note => {
            // Only count notes with content
            if (note.content.trim() !== '') {
                const folderId = note.folderId || '';
                counts.set(folderId, (counts.get(folderId) || 0) + 1);
            }
        });
        return counts;
    }, [notes]);

    const handleNoteClick = (e: React.MouseEvent, note: Note) => {
        onSelectNote(note, e.metaKey || e.ctrlKey, e.shiftKey);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.search}>
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <div className={styles.folders}>
                {folders.map((folder) => (
                    <button
                        key={folder.id}
                        className={`${styles.folderItem} ${selectedFolder === folder.id ? styles.active : ''}`}
                        onClick={() => onSelectFolder(folder.id)}
                    >
                        <FolderIcon size={18} />
                        <span>{folder.name}</span>
                        <span className={styles.count}>
                            {folderCounts.get(folder.id) || 0}
                        </span>
                    </button>
                ))}
            </div>

            <div className={styles.noteList}>
                {filteredNotes.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No notes found</p>
                    </div>
                ) : (
                    filteredNotes.map((note) => (
                        <button
                            key={note.id}
                            className={`${styles.noteItem} ${selectedNoteIds.includes(note.id) ? styles.active : ''}`}
                            onClick={(e) => handleNoteClick(e, note)}
                        >
                            <div className={styles.noteTitle}>{note.title || 'Untitled'}</div>
                            <div className={styles.notePreview}>
                                {note.content.substring(0, 60) || 'No content'}
                            </div>
                            <div className={styles.noteDate}>{formatRelativeTime(note.modifiedAt)}</div>
                        </button>
                    ))
                )}
            </div>
        </aside>
    );
};
