import { useState, useCallback, useRef, useEffect } from 'react';
import type { RecordingState } from '../types/recording';
import { recordingService } from '../services/recording';

export const useRecording = () => {
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [duration, setDuration] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup interval on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    const startRecording = useCallback(async () => {
        try {
            await recordingService.startRecording(true);
            setRecordingState('recording');
            setDuration(0);
            setRecordedBlob(null);

            // Start timer
            intervalRef.current = setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);

            console.log('Recording started');
        } catch (error) {
            console.error('Failed to start recording:', error);
            setRecordingState('idle');
        }
    }, []);

    const stopRecording = useCallback(async () => {
        try {
            setRecordingState('processing');

            // Stop timer
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            const blob = await recordingService.stopRecording();
            setRecordedBlob(blob);
            setRecordingState('idle');

            console.log('Recording stopped, blob created', blob.size);
        } catch (error) {
            console.error('Failed to stop recording:', error);
            setRecordingState('idle');
        }
    }, []);

    const toggleRecording = useCallback(() => {
        if (recordingState === 'recording') {
            stopRecording();
        } else {
            startRecording();
        }
    }, [recordingState, startRecording, stopRecording]);

    const clearRecording = useCallback(() => {
        setRecordedBlob(null);
        setDuration(0);
    }, []);

    return {
        recordingState,
        duration,
        recordedBlob,
        isRecording: recordingState === 'recording',
        isProcessing: recordingState === 'processing',
        startRecording,
        stopRecording,
        toggleRecording,
        clearRecording,
    };
};
