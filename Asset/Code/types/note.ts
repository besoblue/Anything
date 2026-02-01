export interface Note {
    id: string;
    title: string;
    content: string;
    folderId: string | null;
    createdAt: number;
    modifiedAt: number;
    archived: boolean;
}

export interface Folder {
    id: string;
    name: string;
    color: string | null;
    createdAt: number;
}

export type NoteFormData = Omit<Note, 'id' | 'createdAt' | 'modifiedAt' | 'archived'>;

export interface NoteListItem {
    id: string;
    title: string;
    preview: string;
    modifiedAt: number;
    folderId: string | null;
}
