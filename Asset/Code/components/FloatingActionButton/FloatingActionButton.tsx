import React from 'react';
import { Plus } from 'lucide-react';
import styles from './FloatingActionButton.module.css';

interface FloatingActionButtonProps {
    onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
    return (
        <button
            className={styles.fab}
            onClick={onClick}
            aria-label="Create new note"
        >
            <Plus size={32} />
        </button>
    );
};
