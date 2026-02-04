import React from 'react';
import { Menu, Mic, MicOff, Globe, Smartphone, Monitor } from 'lucide-react';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
    isRecording: boolean;
    recordingDuration: number;
    withAudio: boolean;
    language: 'zh' | 'en' | 'both';
    aspectRatio: 'horizontal' | 'vertical';
    onToggleRecording: () => void;
    onToggleSidebar: () => void;
    onToggleAudio: () => void;
    onLanguageChange: (lang: 'zh' | 'en' | 'both') => void;
    onAspectRatioChange: (ratio: 'horizontal' | 'vertical') => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    isRecording,
    recordingDuration,
    withAudio,
    language,
    aspectRatio,
    onToggleRecording,
    onToggleSidebar,
    onToggleAudio,
    onLanguageChange,
    onAspectRatioChange,
}) => {
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button
                    className={styles.menuButton}
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <Menu size={24} />
                </button>
                <h1 className={styles.title}>Anything</h1>
            </div>

            <div className={styles.center}></div>

            <div className={styles.right}>
                <div className={styles.recordButtonWrapper}>
                    <div className={styles.dropdown}>
                        <div className={styles.dropdownSection}>
                            <div className={styles.dropdownLabel}>Audio</div>
                            <div
                                className={`${styles.dropdownOption} ${withAudio ? styles.active : ''}`}
                                onClick={onToggleAudio}
                            >
                                {withAudio ? <Mic size={16} /> : <MicOff size={16} />}
                                <span>{withAudio ? 'Microphone On' : 'Microphone Off'}</span>
                            </div>
                        </div>

                        <div className={styles.dropdownSection}>
                            <div className={styles.dropdownLabel}>Language</div>
                            <div
                                className={`${styles.dropdownOption} ${language === 'en' ? styles.active : ''}`}
                                onClick={() => onLanguageChange('en')}
                            >
                                <Globe size={16} />
                                <span>English</span>
                            </div>
                            <div
                                className={`${styles.dropdownOption} ${language === 'zh' ? styles.active : ''}`}
                                onClick={() => onLanguageChange('zh')}
                            >
                                <Globe size={16} />
                                <span>Chinese</span>
                            </div>
                            <div
                                className={`${styles.dropdownOption} ${language === 'both' ? styles.active : ''}`}
                                onClick={() => onLanguageChange('both')}
                            >
                                <Globe size={16} />
                                <span>Both</span>
                            </div>
                        </div>

                        <div className={styles.dropdownSection}>
                            <div className={styles.dropdownLabel}>Aspect Ratio</div>
                            <div
                                className={`${styles.dropdownOption} ${aspectRatio === 'horizontal' ? styles.active : ''}`}
                                onClick={() => onAspectRatioChange('horizontal')}
                            >
                                <Monitor size={16} />
                                <span>Horizontal (16:9)</span>
                            </div>
                            <div
                                className={`${styles.dropdownOption} ${aspectRatio === 'vertical' ? styles.active : ''}`}
                                onClick={() => onAspectRatioChange('vertical')}
                            >
                                <Smartphone size={16} />
                                <span>Vertical (9:16)</span>
                            </div>
                        </div>
                    </div>

                    {isRecording && (
                        <span className={styles.recordingTime}>{formatTime(recordingDuration)}</span>
                    )}

                    <button
                        className={`${styles.recordButton} ${isRecording ? styles.recording : ''}`}
                        onClick={onToggleRecording}
                        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    >
                        <div className={styles.recordCircle}></div>
                    </button>
                </div>
            </div>
        </header>
    );
};
