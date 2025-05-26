// Base VITE_BACKEND_URL API - change as needed for production
export const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : 'http://localhost:10000/api';

export const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000';

// Feature flags
export const FEATURES = {
  autoSave: false, // Enable auto-save functionality
  versionHistory: true, // Enable version history functionality
};

// Auto-save configuration
export const AUTO_SAVE_DELAY = 2000; // Debounce delay in milliseconds