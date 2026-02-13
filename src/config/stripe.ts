import { loadStripe, Stripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment variables
const stripePublishableKey = (import.meta.env as any).VITE_STRIPE_PUBLISHABLE_KEY || '';

if (!stripePublishableKey && (import.meta.env as any).VITE_ENV !== 'development') {
  console.error('Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable');
}

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// API base URL
export const API_BASE_URL = (import.meta.env as any).VITE_API_URL || 'http://localhost:3001/api';

// Stripe Connect Client ID
export const STRIPE_CONNECT_CLIENT_ID = (import.meta.env as any).VITE_STRIPE_CONNECT_CLIENT_ID || '';
