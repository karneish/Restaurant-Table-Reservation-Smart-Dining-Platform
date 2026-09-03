export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  city: string;
  address: string;
  rating: number;
  avgCostPerHead: number;
  openHours: string;
  imageUrl?: string;
  description?: string;
  features?: string;
  active: boolean;
}

export interface DiningArea {
  id: number;
  restaurantId: number;
  name: string;
  description?: string;
}

export interface RestaurantTable {
  id: number;
  areaId: number;
  restaurantId: number;
  tableNumber: string;
  capacity: number;
  zone: string;
  x: number;
  y: number;
  wheelchairAccessible: boolean;
  quietCorner: boolean;
  cleaningStatus: string;
  cleaningStartedAt?: string;
  cleaningEtaMinutes?: number;
}

export interface TableSlot {
  id: number;
  tableId: number;
  restaurantId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  sessionName: string;
  status: string;
  tableCapacity: number;
  tableNumber: string;
  zone: string;
  cleaningStatus: string;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  category: string;
  price: number;
  dietaryTags?: string;
  spiceLevel?: number;
  prepTimeMinutes?: number;
  available: boolean;
  description?: string;
}

export interface MatchResult {
  table: RestaurantTable;
  score: number;
  reason: string;
  grouped: boolean;
  group?: RestaurantTable[];
  totalCapacity: number;
}

export interface PreOrderItem {
  id: number;
  menuItemId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  category: string;
  dietaryTags?: string;
}

export interface PreOrder {
  id: number;
  reservationId: string;
  status: string;
  totalAmount: number;
  items: PreOrderItem[];
}

export interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  bookingId?: number;
  paymentType?: string;
  createdAt: string;
}

export interface Reservation {
  id: number;
  reservationId: string;
  confirmationCode: string;
  restaurantId: number;
  restaurantName: string;
  restaurantCity: string;
  areaId: number;
  areaName: string;
  reservationDateTime: string;
  partySize: number;
  depositAmount: number;
  status: string;
  userEmail: string;
  occasion?: string;
  celebrationNotes?: string;
  waiterCalled?: boolean;
  billRequested?: boolean;
  billPaid?: boolean;
  billAmount?: number;
  addOns?: OccasionAddOn[];
  tables: RestaurantTable[];
  preOrder?: PreOrder;
  payment?: Payment;
  createdAt: string;
}

export interface OccasionAddOn {
  id: number;
  name: string;
  description?: string;
  price: number;
  emoji?: string;
  applicableOccasions?: string;
  active?: boolean;
}

export interface CompanionSummary {
  reservationId: string;
  confirmationCode: string;
  restaurantName: string;
  restaurantCity: string;
  reservationDateTime: string;
  status: string;
  partySize: number;
  occasion?: string;
  celebrationNotes?: string;
  tables: RestaurantTable[];
  addOns?: OccasionAddOn[];
  preOrder?: PreOrder;
  waiterCalled?: boolean;
  billRequested?: boolean;
  billPaid?: boolean;
  feedbackSubmitted?: boolean;
  amountDue?: number;
}

export interface BillLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Bill {
  reservationId: string;
  confirmationCode: string;
  restaurantName: string;
  restaurantCity?: string;
  tableNumbers: string[];
  lines: BillLineItem[];
  subtotal: number;
  depositPaid: number;
  amountDue: number;
  paid: boolean;
  paidAt?: string;
  billAmount?: number;
  transactionId?: string;
  paymentMethod?: string;
}

export interface FeedbackInput {
  foodRating: number;
  serviceRating: number;
  ambienceRating: number;
  comment?: string;
}

export interface FeedbackRecord {
  id: number;
  reservationId: string;
  restaurantId: number;
  userEmail?: string;
  foodRating: number;
  serviceRating: number;
  ambienceRating: number;
  overallRating: number;
  comment?: string;
  createdAt: string;
}

export interface AppNotification {
  id: number;
  userEmail: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface ProfileData {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  role?: string;
}

export interface WaitlistEntry {
  id: number;
  restaurantId: number;
  slotId: number;
  userEmail: string;
  partySize: number;
  preferredWindow: string;
  status: string;
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
  emailVerified: boolean;
  message: string;
}