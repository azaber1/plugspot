import { describe, it, expect } from 'vitest';
import { calculateBookingCost, PLATFORM_FEE_PERCENTAGE } from '../pricing';
import { Charger } from '../../types';

describe('Booking Cost Calculations', () => {
  const createMockCharger = (overrides: Partial<Charger> = {}): Charger => ({
    id: 'test-charger',
    hostId: 'host-1',
    address: '123 Test St',
    city: 'Test City',
    state: 'CA',
    zipCode: '12345',
    latitude: 37.7749,
    longitude: -122.4194,
    connector: 'CCS',
    powerKW: 9.6,
    pricePerKwh: 0.18,
    accessFee: 2.0,
    available: true,
    description: 'Test charger',
    amenities: [],
    host: {
      name: 'Test Host',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5.0,
      reviewCount: 0,
      verified: true,
    },
    ...overrides,
  });

  it('calculates cost correctly for 1 hour with platform fee', () => {
    const charger = createMockCharger();
    const breakdown = calculateBookingCost(charger, 1);
    
    expect(breakdown.energyCost).toBeCloseTo(1.728, 2);
    expect(breakdown.accessFee).toBe(2.0);
    expect(breakdown.subtotal).toBeCloseTo(3.728, 2);
    expect(breakdown.platformFee).toBeCloseTo(3.728 * PLATFORM_FEE_PERCENTAGE, 2);
    expect(breakdown.total).toBeCloseTo(3.728 * (1 + PLATFORM_FEE_PERCENTAGE), 2);
    expect(breakdown.hostEarnings).toBeCloseTo(3.728 * (1 - PLATFORM_FEE_PERCENTAGE), 2);
  });

  it('calculates cost correctly for 4 hours with platform fee', () => {
    const charger = createMockCharger({
      pricePerKwh: 0.22,
      powerKW: 11.5,
      accessFee: 2.5,
    });
    const breakdown = calculateBookingCost(charger, 4);
    
    expect(breakdown.energyCost).toBeCloseTo(10.12, 2);
    expect(breakdown.accessFee).toBe(2.5);
    expect(breakdown.subtotal).toBeCloseTo(12.62, 2);
    expect(breakdown.platformFee).toBeCloseTo(12.62 * PLATFORM_FEE_PERCENTAGE, 2);
    expect(breakdown.total).toBeCloseTo(12.62 * (1 + PLATFORM_FEE_PERCENTAGE), 2);
    expect(breakdown.hostEarnings).toBeCloseTo(12.62 * (1 - PLATFORM_FEE_PERCENTAGE), 2);
  });

  it('calculates cost correctly for 8 hours with platform fee', () => {
    const charger = createMockCharger({
      pricePerKwh: 0.15,
      powerKW: 7.2,
      accessFee: 1.5,
    });
    const breakdown = calculateBookingCost(charger, 8);
    
    expect(breakdown.energyCost).toBeCloseTo(8.64, 2);
    expect(breakdown.accessFee).toBe(1.5);
    expect(breakdown.subtotal).toBeCloseTo(10.14, 2);
    expect(breakdown.platformFee).toBeCloseTo(10.14 * PLATFORM_FEE_PERCENTAGE, 2);
    expect(breakdown.total).toBeCloseTo(10.14 * (1 + PLATFORM_FEE_PERCENTAGE), 2);
    expect(breakdown.hostEarnings).toBeCloseTo(10.14 * (1 - PLATFORM_FEE_PERCENTAGE), 2);
  });

  it('handles zero duration', () => {
    const charger = createMockCharger();
    const breakdown = calculateBookingCost(charger, 0);
    
    expect(breakdown.energyCost).toBe(0);
    expect(breakdown.accessFee).toBe(2.0);
    expect(breakdown.subtotal).toBe(2.0);
    expect(breakdown.platformFee).toBeCloseTo(2.0 * PLATFORM_FEE_PERCENTAGE, 2);
    expect(breakdown.total).toBeCloseTo(2.0 * (1 + PLATFORM_FEE_PERCENTAGE), 2);
    expect(breakdown.hostEarnings).toBeCloseTo(2.0 * (1 - PLATFORM_FEE_PERCENTAGE), 2);
  });

  it('ensures platform fee is 12%', () => {
    expect(PLATFORM_FEE_PERCENTAGE).toBe(0.12);
  });

  it('ensures host earnings + platform fee equals subtotal', () => {
    const charger = createMockCharger();
    const breakdown = calculateBookingCost(charger, 2);
    
    expect(breakdown.hostEarnings + breakdown.platformFee).toBeCloseTo(breakdown.subtotal, 2);
  });
});
