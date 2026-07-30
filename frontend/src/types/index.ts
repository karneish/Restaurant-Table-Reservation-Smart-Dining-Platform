export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
}

export interface Movie {
  id: number;
  title: string;
  language: string;
  genre: string;
  duration: number;
  rating: number;
  releaseDate: string;
  description?: string;
  posterUrl?: string;
  active: boolean;
}

export interface Theatre {
  id: number;
  name: string;
  address: string;
  city: string;
  active: boolean;
  screens?: Screen[];
}

export interface Screen {
  id: number;
  screenNumber: number;
  totalSeats: number;
  theatreId: number;
}

export interface Show {
  id: number;
  showDate: string;
  showTime: string;
  ticketPrice: number;
  availableSeats: number;
  status: string;
  movieId: number;
  movieTitle?: string;
  screenId: number;
  screenNumber?: number;
  theatreId: number;
  theatreName?: string;
  theatreCity?: string;
}

export interface Seat {
  id: number;
  seatNumber: string;
  seatRow: string;
  category: string;
  status: string;
  screenId: number;
}

export interface Booking {
  id: number;
  bookingId: string;
  ticketNumber: string;
  totalAmount: number;
  status: string;
  userName?: string;
  userEmail: string;
  movieTitle?: string;
  theatreName?: string;
  screenNumber?: number;
  showDate?: string;
  showTime?: string;
  seats: Seat[];
  payment?: Payment;
  createdAt: string;
}

export interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  bookingId: number;
  createdAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: string;
  message: string;
}
