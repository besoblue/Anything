// Application-wide constants

// Auto-save configuration
export const AUTOSAVE_DELAY_MS = 500;

// UI/Animation constants
export const TYPING_ANIMATION_DELAY_MS = 50;
export const NOTE_PREVIEW_LENGTH = 60;
export const MAX_TITLE_LENGTH = 50;

// Storage limits
export const STORAGE_WARNING_THRESHOLD_MB = 4;
export const MAX_RECORDING_DURATION_SECONDS = 1800; // 30 minutes

// Database
export const DATABASE_KEY = 'noteapp_database';

// Placeholder phrases
export const EDITOR_PLACEHOLDERS = [
    'Commit to shit',
    'Your 3 am thoughts',
    'Ideas that seemed genius at the time',
    'Better than forgetting',
    'Your ideas aren\'t that deep',
] as const;
