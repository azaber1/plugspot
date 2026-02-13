import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'plugspot_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, [favorites]);

  const toggleFavorite = (chargerId: string) => {
    setFavorites((prev) =>
      prev.includes(chargerId)
        ? prev.filter((id) => id !== chargerId)
        : [...prev, chargerId]
    );
  };

  const isFavorite = (chargerId: string) => favorites.includes(chargerId);

  return { favorites, toggleFavorite, isFavorite };
};
