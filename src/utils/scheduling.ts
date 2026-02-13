import { Booking, Charger } from '../types';

export interface AvailabilityInfo {
  isAvailable: boolean;
  nextAvailableTime: Date | null;
  currentBooking: Booking | null;
  upcomingBookings: Booking[];
}

/**
 * Calculate the availability of a charger based on actual bookings
 */
export const calculateAvailability = (
  charger: Charger,
  allBookings: Booking[]
): AvailabilityInfo => {
  const now = new Date();
  
  // Get all bookings for this charger that are upcoming or active
  const relevantBookings = allBookings.filter(
    (b) =>
      b.chargerId === charger.id &&
      (b.status === 'upcoming' || b.status === 'active') &&
      new Date(b.endTime) > now
  );

  // Sort by start time
  relevantBookings.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Check if there's a current active booking
  const activeBooking = relevantBookings.find(
    (b) =>
      b.status === 'active' &&
      new Date(b.startTime) <= now &&
      new Date(b.endTime) > now
  );

  // If there's an active booking, charger is not available
  if (activeBooking) {
    return {
      isAvailable: false,
      nextAvailableTime: new Date(activeBooking.endTime),
      currentBooking: activeBooking,
      upcomingBookings: relevantBookings.filter((b) => b.id !== activeBooking.id),
    };
  }

  // Check if there's an upcoming booking starting soon
  const nextBooking = relevantBookings.find(
    (b) => new Date(b.startTime) > now
  );

  if (nextBooking) {
    // If next booking starts in the future, charger is available until then
    const nextStart = new Date(nextBooking.startTime);
    if (nextStart > now) {
      return {
        isAvailable: true,
        nextAvailableTime: nextStart, // Will be unavailable at this time
        currentBooking: null,
        upcomingBookings: relevantBookings,
      };
    }
  }

  // No bookings, charger is available
  return {
    isAvailable: true,
    nextAvailableTime: null,
    currentBooking: null,
    upcomingBookings: [],
  };
};

/**
 * Format the next available time for display
 */
export const formatNextAvailableTime = (date: Date | null): string => {
  if (!date) return 'Available now';
  
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `Available in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    const mins = diffMins % 60;
    if (mins === 0) {
      return `Available in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
    return `Available in ${diffHours}h ${mins}m`;
  } else {
    return `Available in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  }
};

/**
 * Format time for display (e.g., "2:30 PM")
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format date and time for display (e.g., "Jan 20, 2:30 PM")
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Check if a booking should be marked as active based on current time
 */
export const shouldBeActive = (booking: Booking): boolean => {
  const now = new Date();
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  
  return (
    booking.status === 'upcoming' &&
    startTime <= now &&
    endTime > now
  );
};

/**
 * Check if a booking should be marked as completed based on current time
 */
export const shouldBeCompleted = (booking: Booking): boolean => {
  const now = new Date();
  const endTime = new Date(booking.endTime);
  
  return (
    (booking.status === 'upcoming' || booking.status === 'active') &&
    endTime <= now
  );
};

/**
 * Check if a new booking would conflict with existing bookings
 */
export const hasBookingConflict = (
  chargerId: string,
  startTime: Date,
  endTime: Date,
  allBookings: Booking[],
  excludeBookingId?: string
): boolean => {
  const relevantBookings = allBookings.filter(
    (b) =>
      b.chargerId === chargerId &&
      b.id !== excludeBookingId &&
      (b.status === 'upcoming' || b.status === 'active')
  );

  return relevantBookings.some((booking) => {
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);

    // Check for overlap: new booking starts before existing ends AND new booking ends after existing starts
    return startTime < bookingEnd && endTime > bookingStart;
  });
};

/**
 * Get available time slots for a charger
 */
export const getAvailableTimeSlots = (
  charger: Charger,
  allBookings: Booking[],
  date: Date,
  durationHours: number
): Date[] => {
  const slots: Date[] = [];
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Generate slots every hour from 6 AM to 10 PM
  for (let hour = 6; hour <= 22; hour++) {
    const slotStart = new Date(startOfDay);
    slotStart.setHours(hour, 0, 0, 0);
    
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(hour + durationHours, 0, 0, 0);

    // Check if slot is in the past
    if (slotStart < new Date()) continue;

    // Check if slot would conflict with existing bookings
    if (!hasBookingConflict(charger.id, slotStart, slotEnd, allBookings)) {
      slots.push(slotStart);
    }
  }

  return slots;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
