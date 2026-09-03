export const APP_NAME = 'TableHub';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Smart Restaurant Table Reservation & Dining Platform';

export const API_BASE_URL = '/api';
export const API_TIMEOUT = 30000;
export const API_RETRY_ATTEMPTS = 3;

export const TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_EMAIL_KEY = 'userEmail';
export const USER_NAME_KEY = 'userName';
export const USER_ROLE_KEY = 'userRole';
export const USER_ID_KEY = 'userId';

export const RESERVATION_STATUS = {
  HOLD: 'HOLD',
  CONFIRMED: 'CONFIRMED',
  SEATED: 'SEATED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export const PAYMENT_METHODS = {
  CARD: 'CARD',
  UPI: 'UPI',
  CASH: 'CASH',
} as const;

export const CLEANING_STATUS = {
  READY: 'READY',
  DIRTY: 'DIRTY',
  CLEANING: 'CLEANING',
} as const;

export const PREORDER_STATUS = {
  DRAFT: 'DRAFT',
  PLACED: 'PLACED',
  IN_PREP: 'IN_PREP',
  SERVED: 'SERVED',
} as const;

export const RATING = {
  MIN: 1,
  MAX: 5,
  LABELS: ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
} as const;

export const PARTY_SIZE = {
  MIN: 1,
  MAX: 20,
  DEFAULT: 2,
} as const;

export const TOAST_CONFIG = {
  duration: 3500,
  position: 'top-right' as const,
};
