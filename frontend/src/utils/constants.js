// App routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  RESERVATIONS: '/reservations',
  MY_RESERVATIONS: '/reservations/my',
  USERS: '/users',
  SETTINGS: '/settings',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: {
    ME: '/users/me',
    ALL: '/users',
    FILTERED: '/admin/users',
  },
  RESERVATIONS: {
    MY: '/reservations/my',
    ALL: '/admin/reservations',
    BY_ID: '/reservations',
  },
  DASHBOARD: {
    SUMMARY: '/admin/dashboard/summary',
    WEEKLY: '/admin/dashboard/weekly',
    POPULAR_MEALS: '/admin/dashboard/popular-meals',
  },
  SETTINGS: {
    GENERAL: '/admin/settings/general',
    RESERVATION: '/admin/settings/reservation',
    NOTIFICATIONS: '/admin/settings/notifications',
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 10,
};

