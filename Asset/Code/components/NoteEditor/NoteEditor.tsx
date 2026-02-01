import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import type { Note } from '../../types/note';
import styles from './NoteEditor.module.css';
import { EDITOR_PLACEHOLDERS, TYPING_ANIMATION_DELAY_MS } from '../../constants/app';

interface NoteEditorProps {
    note: Note | null;
    onUpdateContent: (content: string) => void;
}

export interface NoteEditorRef {
    focus: () => void;
}

const placeholders = EDITOR_PLACEHOLDERS;

export const NoteEditor = forwardRef<NoteEditorRef, NoteEditorProps>(({
    note,
    onUpdateContent,
}, ref) => {
    const contentRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            contentRef.current?.focus();
        }
    }));

    const [hasOverscroll, setHasOverscroll] = useState(false);
    const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
    const [shouldShowTyping, setShouldShowTyping] = useState(false);
    const fullPlaceholder = useRef(
        placeholders[Math.floor(Math.random() * placeholders.length)]
    );
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check if note is empty when note changes
        if (note && note.content === '') {
            setShouldShowTyping(true);
        } else {
            setShouldShowTyping(false);
            setDisplayedPlaceholder('');
        }
    }, [note?.id]);

    useEffect(() => {
        if (!shouldShowTyping) {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
            }
            return;
        }

        let currentIndex = 0;
        setDisplayedPlaceholder('');

        typingIntervalRef.current = setInterval(() => {
            if (currentIndex < fullPlaceholder.current.length) {
                setDisplayedPlaceholder(fullPlaceholder.current.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                    typingIntervalRef.current = null;
                }
            }
        }, TYPING_ANIMATION_DELAY_MS);

        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
            }
        };
    }, [shouldShowTyping]);

    const checkOverscroll = React.useCallback(() => {
        if (contentRef.current) {
            const { scrollHeight, clientHeight, scrollTop } = contentRef.current;

            // Get current padding-bottom to calculate real content height
            const style = window.getComputedStyle(contentRef.current);
            const paddingBottom = parseFloat(style.paddingBottom);
            const contentHeight = scrollHeight - paddingBottom;

            const isFull = contentHeight > clientHeight;
            setHasOverscroll(isFull);

            // Automatic scroll to middle only if:
            // 1. Content is larger than viewport
            // 2. Typing at the absolute end
            // 3. The text has filled the current viewport (is touching the bottom)
            const isTouchingBottom = Math.abs((scrollTop + clientHeight) - contentHeight) < 10;

            if (isFull &&
                contentRef.current.selectionStart === contentRef.current.value.length &&
                isTouchingBottom
            ) {
                const middlePosition = contentHeight - (clientHeight / 2);
                contentRef.current.scrollTop = middlePosition;
            }
        }
    }, []);

    useEffect(() => {
        if (note && contentRef.current) {
            contentRef.current.value = note.content;
            checkOverscroll();
        }
    }, [note?.id, checkOverscroll]);

    // Handle typing and dynamic overscroll check
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onUpdateContent(newValue);
        checkOverscroll();

        // Check if content becomes empty or has content
        if (newValue === '') {
            setShouldShowTyping(true);
        } else {
            setShouldShowTyping(false);
        }
    };

    if (!note) {
        return (
            <div className={styles.emptyState}>
                <p>Select a note or create a new one to start editing</p>
            </div>
        );
    }

    return (
        <div className={styles.editor}>
            <textarea
                ref={contentRef}
                className={`${styles.contentArea} ${hasOverscroll ? styles.hasOverscroll : ''}`}
                defaultValue={note.content}
                onChange={handleChange}
                placeholder={displayedPlaceholder}
                spellCheck={false}
            />
        </div>
    );
});
