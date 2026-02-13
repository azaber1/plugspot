import { useState, useEffect } from 'react';
import { Booking } from '../types';

const PLATFORM_EARNINGS_KEY = 'plugspot_platform_earnings';

export const usePlatformEarnings = () => {
  const [totalEarnings, setTotalEarnings] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(PLATFORM_EARNINGS_KEY);
      return stored ? parseFloat(stored) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PLATFORM_EARNINGS_KEY, totalEarnings.toString());
    } catch (error) {
      console.error('Failed to save platform earnings:', error);
    }
  }, [totalEarnings]);

  const addEarnings = (amount: number) => {
    setTotalEarnings((prev) => prev + amount);
  };

  const getEarningsFromBookings = (bookings: Booking[]): number => {
    return bookings
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + (b.platformFee || 0), 0);
  };

  return {
    totalEarnings,
    addEarnings,
    getEarningsFromBookings,
  };
};
