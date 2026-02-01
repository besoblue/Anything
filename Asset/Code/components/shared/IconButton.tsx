import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    label: string; // For accessibility
    size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    label,
    size = 'md',
    className = '',
    ...props
}) => {
    return (
        <button
            className={`${styles.iconButton} ${styles[size]} ${className}`}
            aria-label={label}
            title={label}
            {...props}
        >
            {icon}
        </button>
    );
};
