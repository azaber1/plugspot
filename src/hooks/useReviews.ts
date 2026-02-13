import { useState, useEffect } from 'react';
import { Review } from '../types';

const REVIEWS_KEY = 'plugspot_reviews';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    } catch (error) {
      console.error('Failed to save reviews:', error);
    }
  }, [reviews]);

  const addReview = (review: Review) => {
    setReviews((prev) => [...prev, review]);
  };

  const getReviewsByCharger = (chargerId: string) => {
    return reviews.filter((r) => r.chargerId === chargerId);
  };

  const hasUserReviewedCharger = (userId: string, chargerId: string) => {
    return reviews.some((r) => r.userId === userId && r.chargerId === chargerId);
  };

  return {
    reviews,
    addReview,
    getReviewsByCharger,
    hasUserReviewedCharger,
  };
};
