import { useState, useEffect } from 'react';
import { Charger } from '../types';

const CHARGERS_KEY = 'plugspot_user_chargers';

export const useChargers = () => {
  const [userChargers, setUserChargers] = useState<Charger[]>(() => {
    try {
      const stored = localStorage.getItem(CHARGERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHARGERS_KEY, JSON.stringify(userChargers));
    } catch (error) {
      console.error('Failed to save chargers:', error);
    }
  }, [userChargers]);

  const addCharger = (charger: Charger) => {
    setUserChargers((prev) => [...prev, charger]);
  };

  const updateCharger = (chargerId: string, updates: Partial<Charger>) => {
    setUserChargers((prev) =>
      prev.map((c) => (c.id === chargerId ? { ...c, ...updates } : c))
    );
  };

  const deleteCharger = (chargerId: string) => {
    setUserChargers((prev) => prev.filter((c) => c.id !== chargerId));
  };

  const getChargersByHost = (hostId: string) => {
    return userChargers.filter((c) => c.hostId === hostId);
  };

  return {
    userChargers,
    addCharger,
    updateCharger,
    deleteCharger,
    getChargersByHost,
  };
};
