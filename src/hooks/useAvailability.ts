import { useState, useEffect, useCallback } from 'react';
import { chargers } from '../data';
import { Charger } from '../types';
import { useChargers } from './useChargers';
import { useBookings } from './useBookings';
import { calculateAvailability, shouldBeActive, shouldBeCompleted } from '../utils/scheduling';

// Real-time availability based on actual bookings
export const useAvailability = () => {
  const { userChargers } = useChargers();
  const { bookings, updateBookingStatus } = useBookings();
  const [availableChargers, setAvailableChargers] = useState<Charger[]>([]);

  // Update booking statuses based on time
  useEffect(() => {
    const updateBookingStatuses = () => {
      bookings.forEach((booking) => {
        if (shouldBeActive(booking)) {
          updateBookingStatus(booking.id, 'active');
        } else if (shouldBeCompleted(booking)) {
          updateBookingStatus(booking.id, 'completed');
        }
      });
    };

    updateBookingStatuses();
    const interval = setInterval(updateBookingStatuses, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [bookings, updateBookingStatus]);

  // Calculate availability for all chargers
  useEffect(() => {
    const allChargers = [...chargers, ...userChargers];
    
    const chargersWithAvailability = allChargers.map((charger) => {
      const availability = calculateAvailability(charger, bookings);
      
      return {
        ...charger,
        available: availability.isAvailable,
        nextSlot: availability.nextAvailableTime?.toISOString(),
      };
    });

    setAvailableChargers(chargersWithAvailability);
  }, [userChargers, bookings]);

  // Update availability every 30 seconds for real-time feel
  useEffect(() => {
    const interval = setInterval(() => {
      const allChargers = [...chargers, ...userChargers];
      
      const chargersWithAvailability = allChargers.map((charger) => {
        const availability = calculateAvailability(charger, bookings);
        
        return {
          ...charger,
          available: availability.isAvailable,
          nextSlot: availability.nextAvailableTime?.toISOString(),
        };
      });

      setAvailableChargers(chargersWithAvailability);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [userChargers, bookings]);

  const updateAvailability = useCallback((chargerId: string, available: boolean) => {
    // This is for manual host toggling - but availability is primarily calculated from bookings
    setAvailableChargers((prev) =>
      prev.map((c) =>
        c.id === chargerId
          ? {
              ...c,
              available,
              nextSlot: available
                ? undefined
                : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            }
          : c
      )
    );
  }, []);

  return {
    chargers: availableChargers,
    updateAvailability,
  };
};
