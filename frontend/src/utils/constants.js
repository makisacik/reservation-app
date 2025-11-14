export const ROUTES = {
  ONBOARDING: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MENU_MANAGEMENT: '/admin/menu-management',
  ADMIN_RESERVATIONS: '/admin/reservations',
  RESERVATIONS: '/reservations',
  MY_RESERVATIONS: '/reservations/my',
  USERS: '/users',
  ADMIN_USERS: '/admin/users',
  SETTINGS: '/settings',
  ADMIN_SETTINGS: '/admin/settings',
};

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
  MEALS: {
    ALL: '/meals',
    ADMIN_ALL: '/admin/meals',
    BY_ID: '/admin/meals',
  },
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 10,
};

export const HOME_PAGE_CONSTANTS = {
  DEFAULT_CATEGORY: 'Aylık Menü',
  BORDER_RADIUS: '20px',
};

