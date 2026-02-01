import React, { useEffect, useRef } from 'react';
import styles from './ExportView.module.css';

interface ExportViewProps {
    content: string;
    isRecording: boolean;
    aspectRatio: 'horizontal' | 'vertical';
}

/**
 * ExportView - A clean view for screen recording that shows only the note content
 * Always rendered but hidden when not recording
 */
export const ExportView: React.FC<ExportViewProps> = ({ content, isRecording, aspectRatio }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isRecording && contentRef.current) {
            const { scrollHeight, clientHeight, scrollTop } = contentRef.current;

            // Get the actual content height without considering current scroll
            const contentHeight = scrollHeight;
            const isFull = contentHeight > clientHeight;

            // Check if we're at the bottom (typing at the end)
            const isTouchingBottom = Math.abs((scrollTop + clientHeight) - contentHeight) < 10;

            // Automatic scroll to middle when:
            // 1. Content is larger than viewport
            // 2. User is typing at the end (touching bottom)
            if (isFull && isTouchingBottom) {
                const middlePosition = contentHeight - (clientHeight / 2);
                contentRef.current.scrollTop = middlePosition;
            }
        }
    }, [content, isRecording]);

    return (
        <div
            className={styles.exportView}
            data-recording={isRecording ? 'true' : 'false'}
            data-aspect-ratio={aspectRatio}
            data-export-view="true"
        >
            <div ref={contentRef} className={styles.content}>
                {content.split('\n').map((line, index) => (
                    <p key={index} className={styles.line}>
                        {line || '\u00A0'}
                    </p>
                ))}
            </div>
        </div>
    );
};
