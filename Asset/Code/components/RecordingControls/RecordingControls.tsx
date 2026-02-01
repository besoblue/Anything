import React from 'react';
import { Mic, MicOff, Globe } from 'lucide-react';
import styles from './RecordingControls.module.css';

interface RecordingControlsProps {
    withAudio: boolean;
    language: 'zh' | 'en' | 'both';
    onToggleAudio: () => void;
    onLanguageChange: (lang: 'zh' | 'en' | 'both') => void;
    isRecording: boolean;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
    withAudio,
    language,
    onToggleAudio,
    onLanguageChange,
    isRecording,
}) => {
    return (
        <div className={styles.controls}>
            <button
                className={`${styles.iconButton} ${withAudio ? styles.active : ''}`}
                onClick={onToggleAudio}
                disabled={isRecording}
                title={withAudio ? 'Microphone On' : 'Microphone Off'}
            >
                {withAudio ? <Mic size={18} /> : <MicOff size={18} />}
            </button>

            <div className={styles.languageSelector}>
                <Globe size={18} className={styles.globeIcon} />
                <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value as any)}
                    disabled={isRecording}
                    className={styles.select}
                >
                    <option value="en">English</option>
                    <option value="zh">Chinese</option>
                    <option value="both">Both</option>
                </select>
            </div>
        </div>
    );
};
