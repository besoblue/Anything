import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (timestamp: number): string => {
    return format(timestamp, 'MMM d, yyyy');
};

export const formatDateTime = (timestamp: number): string => {
    return format(timestamp, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (timestamp: number): string => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
};

export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
