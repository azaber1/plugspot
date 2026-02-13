import { Charger } from '../types';

export const PLATFORM_FEE_PERCENTAGE = 0.12; // 12% platform fee (similar to Airbnb)

export interface BookingCostBreakdown {
  energyCost: number;
  accessFee: number;
  subtotal: number;
  platformFee: number;
  total: number;
  hostEarnings: number;
}

/**
 * Calculate the total booking cost including platform fee
 */
export const calculateBookingCost = (
  charger: Charger,
  durationHours: number
): BookingCostBreakdown => {
  const energyCost = charger.pricePerKwh * charger.powerKW * durationHours;
  const subtotal = energyCost + charger.accessFee;
  const platformFee = subtotal * PLATFORM_FEE_PERCENTAGE;
  const total = subtotal + platformFee;
  const hostEarnings = subtotal - platformFee;

  return {
    energyCost,
    accessFee: charger.accessFee,
    subtotal,
    platformFee,
    total,
    hostEarnings,
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
