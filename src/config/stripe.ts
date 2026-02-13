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

// API base URL - ensure it doesn't end with /api/api
let apiUrl = (import.meta.env as any).VITE_API_URL || 'http://localhost:3001/api';
// Remove trailing slash if present
apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
// Ensure it ends with /api
if (!apiUrl.endsWith('/api')) {
  apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api` : `${apiUrl}/api`;
}
export const API_BASE_URL = apiUrl;

// Stripe Connect Client ID
export const STRIPE_CONNECT_CLIENT_ID = (import.meta.env as any).VITE_STRIPE_CONNECT_CLIENT_ID || '';
