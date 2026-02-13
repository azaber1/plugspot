import { useState, useEffect } from 'react';
import { Booking } from '../types';

const BOOKINGS_KEY = 'plugspot_bookings';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKINGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error('Failed to save bookings:', error);
    }
  }, [bookings]);

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const markBookingAsReviewed = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, hasReview: true } : b))
    );
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  const getBookingsByUser = (userId: string) => {
    return bookings.filter((b) => b.userId === userId);
  };

  const getBookingsByCharger = (chargerId: string) => {
    return bookings.filter((b) => b.chargerId === chargerId);
  };

  return {
    bookings,
    addBooking,
    updateBookingStatus,
    markBookingAsReviewed,
    cancelBooking,
    getBookingsByUser,
    getBookingsByCharger,
  };
};
