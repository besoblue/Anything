import { useEffect, useState } from 'react';
import { db } from '../services/database';

export const useDatabase = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const initDb = async () => {
            try {
                await db.initialize();
                setIsInitialized(true);
            } catch (err) {
                setError(err as Error);
                console.error('Database initialization failed:', err);
            }
        };

        initDb();

        // Cleanup on unmount
        return () => {
            db.close();
        };
    }, []);

    return { isInitialized, error };
};
