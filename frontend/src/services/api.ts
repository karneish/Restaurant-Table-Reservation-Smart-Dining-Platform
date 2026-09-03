import axios from 'axios';
import type {
  APIResponse, Restaurant, DiningArea, RestaurantTable,
  TableSlot, MenuItem, MatchResult, Reservation, WaitlistEntry, AuthResponse,
  OccasionAddOn, CompanionSummary, AppNotification, ProfileData,
  Bill, FeedbackInput, FeedbackRecord,
} from '../types';
import { GUEST_EMAIL } from '../context/AuthContext';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-User-Email'] = localStorage.getItem('userEmail') ?? GUEST_EMAIL;
  return config;
});

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const rt = localStorage.getItem('refreshToken');
  if (!rt) return false;
  try {
    const res = await axios.post<APIResponse<AuthResponse>>('/api/auth/refresh', { refreshToken: rt });
    const data = res.data.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userId', String(data.userId));
    return true;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    return false;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Retry on 429 (rate limit) with exponential backoff — up to 3 attempts
    if (error.response?.status === 429 && !original?._retry429) {
      original._retry429 = (original._retry429 || 0) + 1;
      if (original._retry429 <= 3) {
        const delay = Math.min(1000 * 2 ** (original._retry429 - 1), 8000);
        await new Promise((r) => setTimeout(r, delay));
        return api(original);
      }
    }

    if (error.response?.status !== 401 || original?._retry || original?.url?.includes('/auth/')) {
      return Promise.reject(error);
    }
    original._retry = true;
    refreshPromise = refreshPromise ?? tryRefresh();
    const ok = await refreshPromise;
    refreshPromise = null;
    if (ok) {
      original.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
      return api(original);
    }
    return Promise.reject(error);
  },
);

/** Pull a human-readable message out of an API error. */
export function errorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 429) return 'Server is busy. Please try again in a moment.';
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message || err.message || fallback;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string }) =>
    api.post<APIResponse<AuthResponse>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<APIResponse<AuthResponse>>('/auth/login', data),
  refresh: (refreshToken: string) =>
    api.post<APIResponse<AuthResponse>>('/auth/refresh', { refreshToken }),
  sendOtp: (email: string) =>
    api.post<APIResponse<void>>('/auth/send-otp', { email }),
  verifyOtp: (email: string, otp: string) =>
    api.post<APIResponse<boolean>>('/auth/verify-otp', { email, otp }),
};

export const restaurantAPI = {
  getAll: () => api.get<APIResponse<Restaurant[]>>('/restaurants'),
  getActive: () => api.get<APIResponse<Restaurant[]>>('/restaurants/active'),
  getById: (id: number) => api.get<APIResponse<Restaurant>>(`/restaurants/${id}`),
  search: (q: string) => api.get<APIResponse<Restaurant[]>>(`/restaurants/search?q=${q}`),
  getByCuisine: (cuisine: string) => api.get<APIResponse<Restaurant[]>>(`/restaurants/cuisine/${cuisine}`),
  getByCity: (city: string) => api.get<APIResponse<Restaurant[]>>(`/restaurants/city/${city}`),
  getMenu: (id: number) => api.get<APIResponse<MenuItem[]>>(`/restaurants/${id}/menu`),
  create: (data: Record<string, unknown>) => api.post<APIResponse<Restaurant>>('/restaurants', data),
  update: (id: number, data: Record<string, unknown>) => api.put<APIResponse<Restaurant>>(`/restaurants/${id}`, data),
  remove: (id: number) => api.delete<APIResponse<void>>(`/restaurants/${id}`),
  addMenuItem: (id: number, data: Record<string, unknown>) =>
    api.post<APIResponse<MenuItem>>(`/restaurants/${id}/menu`, data),
  updateMenuItem: (id: number, itemId: number, data: Record<string, unknown>) =>
    api.put<APIResponse<MenuItem>>(`/restaurants/${id}/menu/${itemId}`, data),
  deleteMenuItem: (id: number, itemId: number) =>
    api.delete<APIResponse<void>>(`/restaurants/${id}/menu/${itemId}`),
};

export const tableAPI = {
  getAreas: (restaurantId: number) => api.get<APIResponse<DiningArea[]>>(`/restaurants/${restaurantId}/areas`),
  createArea: (restaurantId: number, data: { name: string; description?: string }) =>
    api.post<APIResponse<DiningArea>>(`/restaurants/${restaurantId}/areas`, data),
  getTablesByArea: (areaId: number) => api.get<APIResponse<RestaurantTable[]>>(`/areas/${areaId}/tables`),
  createTable: (areaId: number, data: Record<string, unknown>) =>
    api.post<APIResponse<RestaurantTable>>(`/areas/${areaId}/tables`, data),
  getById: (id: number) => api.get<APIResponse<RestaurantTable>>(`/tables/${id}`),
  findMatches: (params: { restaurantId: number; partySize: number; zone?: string; accessible?: boolean; quiet?: boolean; occasion?: string }) =>
    api.get<APIResponse<MatchResult[]>>('/tables/match', { params }),
  updateCleaning: (id: number, data: { status: string; staffEmail?: string; note?: string }) =>
    api.put<APIResponse<RestaurantTable>>(`/tables/${id}/cleaning`, data),
};

export const slotAPI = {
  getAll: () => api.get<APIResponse<TableSlot[]>>('/slots'),
  getAvailable: (params: { restaurantId: number; date: string; partySize?: number }) =>
    api.get<APIResponse<TableSlot[]>>('/slots/availability', { params }),
  getByRestaurantDate: (restaurantId: number, date: string) =>
    api.get<APIResponse<TableSlot[]>>(`/slots/restaurant/${restaurantId}/date`, { params: { date } }),
  create: (data: Record<string, unknown>) => api.post<APIResponse<TableSlot>>('/slots', data),
  close: (id: number) => api.delete<APIResponse<void>>(`/slots/${id}`),
};

export const reservationAPI = {
  create: (data: {
    restaurantId: number;
    areaId: number;
    slotId: number;
    partySize: number;
    tableIds: number[];
    preOrderItems?: { menuItemId: number; quantity: number }[];
    occasion?: string;
    celebrationNotes?: string;
    addOns?: { addOnId: number; quantity: number }[];
  }) => api.post<APIResponse<Reservation>>('/reservations', data),
  confirm: (reservationId: string, paymentMethod = 'CARD') =>
    api.post<APIResponse<Reservation>>(`/reservations/${reservationId}/pay`, { paymentMethod }),
  cancel: (reservationId: string) =>
    api.post<APIResponse<Reservation>>(`/reservations/${reservationId}/cancel`),
  getByReservationId: (reservationId: string) =>
    api.get<APIResponse<Reservation>>(`/reservations/reservation/${reservationId}`),
  getByUser: () => api.get<APIResponse<Reservation[]>>('/reservations/user'),
  getAll: () => api.get<APIResponse<Reservation[]>>('/reservations'),
  updateStatus: (reservationId: string, status: string, staffEmail?: string) =>
    api.put<APIResponse<Reservation>>(`/reservations/${reservationId}/status`, { status, staffEmail }),
  submitPreOrder: (reservationId: string) =>
    api.post<APIResponse<Reservation>>(`/reservations/${reservationId}/preorder`),
  updatePreOrderStatus: (preOrderId: number, status: string) =>
    api.put<APIResponse<Reservation>>(`/reservations/preorders/${preOrderId}/status`, { status }),
  joinWaitlist: (data: { restaurantId: number; slotId?: number; partySize: number; preferredWindow?: string }) =>
    api.post<APIResponse<WaitlistEntry>>('/reservations/waitlist', data),
   getWaitlistByUser: () => api.get<APIResponse<WaitlistEntry[]>>('/reservations/waitlist/user'),
  getAddOns: (occasion?: string) =>
    api.get<APIResponse<OccasionAddOn[]>>('/reservations/add-ons', { params: occasion ? { occasion } : {} }),
  submitFeedback: (reservationId: string, data: FeedbackInput) =>
    api.post<APIResponse<FeedbackRecord>>(`/reservations/${reservationId}/feedback`, data),
  getRestaurantFeedback: (restaurantId: number) =>
    api.get<APIResponse<FeedbackRecord[]>>(`/reservations/feedback/restaurant/${restaurantId}`),
  companion: {
    get: (reservationId: string) =>
      api.get<APIResponse<CompanionSummary>>(`/reservations/companion/${reservationId}`),
    callWaiter: (reservationId: string) =>
      api.post<APIResponse<CompanionSummary>>(`/reservations/companion/${reservationId}/call-waiter`),
    requestBill: (reservationId: string) =>
      api.post<APIResponse<CompanionSummary>>(`/reservations/companion/${reservationId}/request-bill`),
    getBill: (reservationId: string) =>
      api.get<APIResponse<Bill>>(`/reservations/companion/${reservationId}/bill`),
    payBill: (reservationId: string, paymentMethod = 'UPI') =>
      api.post<APIResponse<Bill>>(`/reservations/companion/${reservationId}/pay-bill`, { paymentMethod }),
  },
};

export const userAPI = {
  getProfile: () => api.get<APIResponse<ProfileData>>('/users/profile'),
  updateProfile: (data: Partial<ProfileData>) => api.put<APIResponse<ProfileData>>('/users/profile', data),
};

export const notificationAPI = {
  get: () => api.get<APIResponse<AppNotification[]>>('/notifications', { params: { userEmail: localStorage.getItem('userEmail') ?? GUEST_EMAIL } }),
  unreadCount: () => api.get<APIResponse<number>>('/notifications/unread-count', { params: { userEmail: localStorage.getItem('userEmail') ?? GUEST_EMAIL } }),
  markRead: (id: number) => api.put<APIResponse<AppNotification>>(`/notifications/${id}/read`),
  markAllRead: () => api.put<APIResponse<void>>('/notifications/read-all', undefined, { params: { userEmail: localStorage.getItem('userEmail') ?? GUEST_EMAIL } }),
};

export default api;
