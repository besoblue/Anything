import { useState, useEffect, useCallback, useRef } from 'react';
import type { Note } from './types/note';
import { useDatabase } from './hooks/useDatabase';
import { useNotes } from './hooks/useNotes';
import { useRecording } from './hooks/useRecording';
import { useAutoSave } from './hooks/useAutoSave';
import { AppHeader } from './components/AppHeader/AppHeader';
import { Sidebar } from './components/Sidebar/Sidebar';
import { NoteEditor, type NoteEditorRef } from './components/NoteEditor/NoteEditor';
import { FloatingActionButton } from './components/FloatingActionButton/FloatingActionButton';
import { ExportModal } from './components/ExportModal/ExportModal';
import { ExportView } from './components/ExportView/ExportView';
import { AUTOSAVE_DELAY_MS, MAX_TITLE_LENGTH } from './constants/app';
import './styles/variables.css';
import './styles/globals.css';
import './styles/animations.css';
import styles from './App.module.css';

function App() {
    const editorRef = useRef<NoteEditorRef>(null);
    const { isInitialized, error } = useDatabase();
    const {
        notes,
        folders,
        currentNote,
        selectedFolder,
        setCurrentNote,
        setSelectedFolder,
        createNote,
        updateNote,
        deleteNotes,
    } = useNotes(isInitialized);

    const { isRecording, duration, recordedBlob, startRecording, stopRecording } = useRecording();

    const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [withAudio, setWithAudio] = useState(true);
    const [language, setLanguage] = useState<'zh' | 'en' | 'both'>('en');
    const [aspectRatio, setAspectRatio] = useState<'horizontal' | 'vertical'>('horizontal');

    const handleToggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    const handleToggleAudio = useCallback(() => {
        setWithAudio(prev => !prev);
    }, []);

    const handleLanguageChange = useCallback((lang: 'zh' | 'en' | 'both') => {
        setLanguage(lang);
    }, []);

    const handleAspectRatioChange = useCallback((ratio: 'horizontal' | 'vertical') => {
        setAspectRatio(ratio);
    }, []);

    const handleToggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
            // Focus the editor when recording starts
            setTimeout(() => {
                editorRef.current?.focus();
            }, 100);
        }
    }, [isRecording, startRecording, stopRecording]);

    const handleCreateNote = useCallback(() => {
        const newNote = createNote();
        if (newNote) {
            setCurrentNote(newNote);
            setNoteTitle(newNote.title);
            setNoteContent(newNote.content);
        }
    }, [createNote, setCurrentNote]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isTextarea = target.tagName === 'TEXTAREA';
            const isInput = target.tagName === 'INPUT';

            // Handle delete/backspace for note deletion
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNoteIds.length > 0) {
                // If in textarea, only delete note if textarea is empty OR if using Cmd/Ctrl modifier
                if (isTextarea) {
                    const textarea = target as HTMLTextAreaElement;
                    const isEmpty = textarea.value === '';
                    const hasModifier = e.metaKey || e.ctrlKey;

                    if (isEmpty || hasModifier) {
                        e.preventDefault();
                        const message = selectedNoteIds.length === 1
                            ? 'Are you sure you want to delete this note?'
                            : `Are you sure you want to delete ${selectedNoteIds.length} notes?`;

                        if (window.confirm(message)) {
                            deleteNotes(selectedNoteIds);
                            setSelectedNoteIds([]);
                        }
                    }
                } else if (!isInput) {
                    // Not in any input field, safe to delete note
                    e.preventDefault();
                    const message = selectedNoteIds.length === 1
                        ? 'Are you sure you want to delete this note?'
                        : `Are you sure you want to delete ${selectedNoteIds.length} notes?`;

                    if (window.confirm(message)) {
                        deleteNotes(selectedNoteIds);
                        setSelectedNoteIds([]);
                    }
                }
            }

            // Handle Cmd/Ctrl+N for new note
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                handleCreateNote();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNoteIds, deleteNotes, handleCreateNote]);

    const handleSelectNote = useCallback((note: Note, multiSelect = false, rangeSelect = false) => {
        if (!note) return;

        let newSelectedIds: string[] = [];

        if (rangeSelect && selectedNoteIds.length > 0) {
            const lastSelectedId = selectedNoteIds[selectedNoteIds.length - 1];
            const lastIdx = notes.findIndex(n => n.id === lastSelectedId);
            const currentIdx = notes.findIndex(n => n.id === note.id);

            if (lastIdx !== -1 && currentIdx !== -1) {
                const start = Math.min(lastIdx, currentIdx);
                const end = Math.max(lastIdx, currentIdx);
                newSelectedIds = notes.slice(start, end + 1).map(n => n.id);
            } else {
                newSelectedIds = [note.id];
            }
        } else if (multiSelect) {
            if (selectedNoteIds.includes(note.id)) {
                newSelectedIds = selectedNoteIds.filter(id => id !== note.id);
            } else {
                newSelectedIds = [...selectedNoteIds, note.id];
            }
        } else {
            newSelectedIds = [note.id];
        }

        setSelectedNoteIds(newSelectedIds);

        if (newSelectedIds.length > 0) {
            const finalNote = notes.find(n => n.id === newSelectedIds[newSelectedIds.length - 1]);
            if (finalNote) {
                setCurrentNote(finalNote);
                setNoteTitle(finalNote.title);
                setNoteContent(finalNote.content);
            }
        }
    }, [notes, selectedNoteIds, setCurrentNote]);

    // Auto-create a note on launch if none exists
    useEffect(() => {
        if (isInitialized && notes.length === 0 && !currentNote) {
            handleCreateNote();
        } else if (isInitialized && notes.length > 0 && !currentNote) {
            handleSelectNote(notes[0]);
        }
    }, [isInitialized, notes.length, currentNote, handleCreateNote, handleSelectNote]);

    // Auto-save note changes
    useAutoSave(
        { title: noteTitle, content: noteContent },
        (value) => {
            if (currentNote && isInitialized) {
                updateNote(currentNote.id, {
                    title: value.title,
                    content: value.content,
                });
            }
        },
        AUTOSAVE_DELAY_MS
    );

    // Sync local state when currentNote changes
    useEffect(() => {
        if (currentNote) {
            setNoteTitle(currentNote.title);
            setNoteContent(currentNote.content);
        }
    }, [currentNote]);

    const handleUpdateContent = useCallback((content: string) => {
        setNoteContent(content);
        const firstLine = content.split('\n')[0].trim();
        if (firstLine && firstLine !== noteTitle) {
            setNoteTitle(firstLine.substring(0, MAX_TITLE_LENGTH));
        } else if (!firstLine && noteTitle !== 'Untitled') {
            setNoteTitle('Untitled');
        }
    }, [noteTitle]);

    const handleExport = useCallback(() => {
        setIsExportModalOpen(true);
    }, []);

    const handleEditorClick = useCallback(() => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    }, [isSidebarOpen]);

    // Trigger export modal when recording stops
    useEffect(() => {
        if (!isRecording && duration > 0 && recordedBlob) {
            handleExport();
        }
    }, [isRecording, duration, recordedBlob]);

    if (error) {
        return (
            <div className={styles.error}>
                <h1>Database Error</h1>
                <p>{error.message}</p>
            </div>
        );
    }

    if (!isInitialized) {
        return (
            <div className={styles.loading}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className={styles.app}>
            <AppHeader
                isRecording={isRecording}
                recordingDuration={duration}
                withAudio={withAudio}
                language={language}
                aspectRatio={aspectRatio}
                onToggleRecording={handleToggleRecording}
                onToggleSidebar={handleToggleSidebar}
                onToggleAudio={handleToggleAudio}
                onLanguageChange={handleLanguageChange}
                onAspectRatioChange={handleAspectRatioChange}
            />

            <div className={styles.main}>
                <div className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.open : ''}`}>
                    <Sidebar
                        notes={notes}
                        folders={folders}
                        selectedNoteIds={selectedNoteIds}
                        selectedFolder={selectedFolder}
                        onSelectNote={handleSelectNote}
                        onSelectFolder={setSelectedFolder}
                    />
                </div>

                <div className={styles.editorContainer} onClick={handleEditorClick}>
                    <NoteEditor
                        ref={editorRef}
                        note={currentNote}
                        onUpdateContent={handleUpdateContent}
                    />
                </div>
            </div>

            <FloatingActionButton onClick={handleCreateNote} />

            <ExportView
                content={noteContent}
                isRecording={isRecording}
                aspectRatio={aspectRatio}
            />

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                note={currentNote}
                recordedBlob={recordedBlob}
                aspectRatio={aspectRatio}
                onAspectRatioChange={handleAspectRatioChange}
            />
        </div>
    );
}

export default App;
