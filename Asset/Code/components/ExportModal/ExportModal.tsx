import React, { useState, useEffect } from 'react';
import { Video, ArrowDown } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Note } from '../../types/note';
import { exportService, ExportOptions } from '../../services/export';
import styles from './ExportModal.module.css';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note | null;
    recordedBlob: Blob | null;
    aspectRatio: 'horizontal' | 'vertical';
    onAspectRatioChange: (ratio: 'horizontal' | 'vertical') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
    isOpen,
    onClose,
    note,
    recordedBlob,
    aspectRatio,
    onAspectRatioChange,
}) => {
    const [filename, setFilename] = useState('');
    const [format, setFormat] = useState<'mp4' | 'webm' | 'md'>('webm');
    const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFilename(exportService.getDefaultFilename(note));
            // Default to WebM if recording exists, otherwise MD
            setFormat(recordedBlob ? 'webm' : 'md');
        }
    }, [isOpen, note, recordedBlob]);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            if (format === 'mp4' || format === 'webm') {
                if (recordedBlob) {
                    exportService.exportRecording(recordedBlob, {
                        format: format as any,
                        aspectRatio,
                        quality,
                        filename,
                    });
                }
            } else {
                if (note) {
                    exportService.exportNote(note, format as 'md' | 'txt');
                }
            }

            // Close modal immediately after export without showing "Saved" state
            onClose();
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
            <div className={styles.container}>
                <div className={styles.scrollableContent}>
                    <div className={styles.section}>
                        <label className={styles.label}>Filename</label>
                        <Input
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="my_awesome_note"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>Export Format</label>
                        <div className={styles.optionsGrid}>
                            {recordedBlob && (
                                <>
                                    <button
                                        className={`${styles.optionCard} ${format === 'mp4' ? styles.active : ''}`}
                                        onClick={() => setFormat('mp4')}
                                    >
                                        <Video size={24} />
                                        <span>Video (MP4)</span>
                                    </button>
                                    <button
                                        className={`${styles.optionCard} ${format === 'webm' ? styles.active : ''}`}
                                        onClick={() => setFormat('webm')}
                                    >
                                        <Video size={24} />
                                        <span>Video (WebM)</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {(format === 'mp4' || format === 'webm') && (
                        <>
                            <div className={styles.section}>
                                <label className={styles.label}>Aspect Ratio (set before recording)</label>
                                <div className={styles.toggleGroup}>
                                    <button
                                        className={`${styles.toggleItem} ${aspectRatio === 'horizontal' ? styles.active : ''}`}
                                        disabled
                                        style={{ cursor: 'not-allowed', opacity: 0.6 }}
                                    >
                                        Horizontal (16:9)
                                    </button>
                                    <button
                                        className={`${styles.toggleItem} ${aspectRatio === 'vertical' ? styles.active : ''}`}
                                        disabled
                                        style={{ cursor: 'not-allowed', opacity: 0.6 }}
                                    >
                                        Vertical (9:16)
                                    </button>
                                </div>
                            </div>

                            <div className={styles.section}>
                                <label className={styles.label}>Video Quality</label>
                                <div className={styles.toggleGroup}>
                                    {(['low', 'medium', 'high'] as const).map((q) => (
                                        <button
                                            key={q}
                                            className={`${styles.toggleItem} ${quality === q ? styles.active : ''}`}
                                            onClick={() => setQuality(q)}
                                        >
                                            {q.charAt(0).toUpperCase() + q.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.footer}>
                    <Button variant="secondary" onClick={onClose} disabled={isExporting}>
                        Cancel
                    </Button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={styles.exportButton}
                    >
                        {isExporting ? 'Processing...' : <ArrowDown size={18} />}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
