export const AUTH_EP = { REGISTER: '/auth/register', LOGIN: '/auth/login', REFRESH: '/auth/refresh', SEND_OTP: '/auth/send-otp', VERIFY_OTP: '/auth/verify-otp' } as const;
export const USER_EP = { PROFILE: '/users/profile' } as const;
export const RESTAURANT_EP = { LIST: '/restaurants', ACTIVE: '/restaurants/active', BY_ID: (id: number) => `/restaurants/${id}`, MENU: (id: number) => `/restaurants/${id}/menu`, AREAS: (id: number) => `/restaurants/${id}/areas` } as const;
export const TABLE_EP = { BY_ID: (id: number) => `/tables/${id}`, MATCH: '/tables/match', BY_AREA: (id: number) => `/areas/${id}/tables` } as const;
export const SLOT_EP = { LIST: '/slots', AVAILABLE: '/slots/availability', BY_REST_DATE: (id: number) => `/slots/restaurant/${id}/date` } as const;
export const RESERVATION_EP = { CREATE: '/reservations', PAY: (id: string) => `/reservations/${id}/pay`, CANCEL: (id: string) => `/reservations/${id}/cancel`, BY_ID: (id: string) => `/reservations/reservation/${id}`, USER: '/reservations/user', COMPANION: (id: string) => `/reservations/companion/${id}` } as const;
export const PAYMENT_EP = { PROCESS: '/payments/process', BY_ID: (id: number) => `/payments/${id}`, REFUND: (id: number) => `/payments/${id}/refund` } as const;
export const NOTIFICATION_EP = { LIST: '/notifications', MARK_READ: (id: number) => `/notifications/${id}/read`, MARK_ALL: '/notifications/read-all' } as const;
