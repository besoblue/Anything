import { useEffect, useRef, useCallback } from 'react';

// Shallow equality check for objects with known structure
const shallowEqual = <T extends Record<string, any>>(a: T, b: T): boolean => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => a[key] === b[key]);
};

export const useAutoSave = <T extends Record<string, any>>(
    value: T,
    onSave: (value: T) => void,
    delay: number = 2000
) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const previousValueRef = useRef<T>(value);

    const save = useCallback(() => {
        onSave(value);
        previousValueRef.current = value;
    }, [value, onSave]);

    useEffect(() => {
        // Don't save if value hasn't changed (use shallow comparison for performance)
        if (shallowEqual(value, previousValueRef.current)) {
            return;
        }

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            save();
        }, delay);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [value, delay, save]);

    // Manual save function
    const saveNow = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        save();
    }, [save]);

    return { saveNow };
};
