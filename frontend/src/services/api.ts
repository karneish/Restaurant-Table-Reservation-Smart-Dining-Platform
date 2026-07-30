import axios from 'axios';
import type { APIResponse, AuthResponse, Movie, Theatre, Show, Seat, Booking } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const email = localStorage.getItem('userEmail');
  if (email) {
    config.headers['X-User-Email'] = email;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post<APIResponse<AuthResponse>>('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<APIResponse<AuthResponse>>('/auth/register', data),
};

export const movieAPI = {
  getAll: () => api.get<APIResponse<Movie[]>>('/movies'),
  getActive: () => api.get<APIResponse<Movie[]>>('/movies/active'),
  getById: (id: number) => api.get<APIResponse<Movie>>(`/movies/${id}`),
  search: (q: string) => api.get<APIResponse<Movie[]>>(`/movies/search?q=${q}`),
  getByLanguage: (lang: string) => api.get<APIResponse<Movie[]>>(`/movies/language/${lang}`),
};

export const theatreAPI = {
  getAll: () => api.get<APIResponse<Theatre[]>>('/theatres'),
  getActive: () => api.get<APIResponse<Theatre[]>>('/theatres/active'),
  getByCity: (city: string) => api.get<APIResponse<Theatre[]>>(`/theatres/city/${city}`),
  getById: (id: number) => api.get<APIResponse<Theatre>>(`/theatres/${id}`),
  getSeats: (screenId: number) => api.get<APIResponse<Seat[]>>(`/theatres/screens/${screenId}/seats`),
};

export const showAPI = {
  search: (params: { movieId?: number; theatreId?: number; date: string }) =>
    api.get<APIResponse<Show[]>>('/shows/search', { params }),
  getByMovie: (movieId: number) => api.get<APIResponse<Show[]>>(`/shows/movie/${movieId}`),
};

export const bookingAPI = {
  create: (showId: number, seatIds: number[]) =>
    api.post<APIResponse<Booking>>('/bookings', { showId, seatIds }),
  confirm: (bookingId: string, paymentMethod: string) =>
    api.post<APIResponse<Booking>>(`/bookings/${bookingId}/pay`, { paymentMethod }),
  cancel: (bookingId: string) =>
    api.post<APIResponse<Booking>>(`/bookings/${bookingId}/cancel`),
  getByBookingId: (bookingId: string) =>
    api.get<APIResponse<Booking>>(`/bookings/bookingId/${bookingId}`),
  getByTicket: (ticketNumber: string) =>
    api.get<APIResponse<Booking>>(`/bookings/ticket/${ticketNumber}`),
  joinWaitlist: (showId: number, seats: number) =>
    api.post('/bookings/waitlist', { showId, seats }),
};

export default api;
