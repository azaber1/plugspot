export type ConnectorType = 'J1772' | 'CCS' | 'Tesla NACS' | 'CHAdeMO';

export interface Charger {
  id: string;
  hostId: string;
  host: {
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
  };
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
  distance?: number;
  connector: ConnectorType;
  powerKW: number;
  pricePerKwh: number;
  accessFee: number;
  amenities: string[];
  available: boolean;
  nextSlot?: string;
  description: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  bookingId: string;
  chargerId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export type BookingStatus = 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  chargerId: string;
  charger: Charger;
  userId: string;
  userName: string;
  userAvatar: string;
  startTime: string;
  endTime: string;
  duration: number; // hours
  status: BookingStatus;
  totalCost: number;
  energyCost: number;
  accessFee: number;
  platformFee: number;
  hostEarnings: number;
  createdAt: string;
  hasReview: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export type UserRole = 'user' | 'host' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  verified?: boolean;
  createdAt?: string;
}

export interface AvailabilityInfo {
  isAvailable: boolean;
  nextAvailableTime?: string;
  currentBooking?: Booking;
  upcomingBookings: Booking[];
}

export interface StripeAccount {
  hostId: string;
  accountId: string;
  email: string;
  isConnected: boolean;
  connectedAt?: string;
}
