import { API_BASE_URL, STRIPE_CONNECT_CLIENT_ID } from '../config/stripe';

export interface CreatePaymentIntentRequest {
  amount: number; // in cents
  currency: string;
  chargerId: string;
  hostStripeAccountId: string;
  bookingId: string;
  applicationFeeAmount: number; // platform commission in cents
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface StripeConnectAccount {
  accountId: string;
  email: string;
  isActive: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

export interface CreateStripeConnectAccountResponse {
  accountId: string;
  onboardingUrl?: string;
}

/**
 * Create a payment intent with Stripe Connect for split payments
 */
export const createPaymentIntent = async (
  amount: number,
  hostStripeAccountId: string,
  chargerId: string,
  bookingId: string
): Promise<{ clientSecret: string; paymentIntentId: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        hostStripeAccountId,
        chargerId,
        bookingId,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to create payment intent' }));
      throw new Error(error.error || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    // Fallback for development if backend is not available
    if (import.meta.env.DEV && error.message.includes('fetch')) {
      console.warn('Backend not available, using mock payment intent');
      return {
        clientSecret: 'mock_client_secret_' + Date.now(),
        paymentIntentId: 'pi_mock_' + Date.now(),
      };
    }
    throw new Error(error.message || 'Failed to create payment intent');
  }
};

/**
 * Confirm a payment intent
 */
export const confirmPaymentIntent = async (
  paymentIntentId: string
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentIntentId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to confirm payment' }));
      throw new Error(error.error || 'Failed to confirm payment');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    // Fallback for development if backend is not available
    if (import.meta.env.DEV && error.message.includes('fetch')) {
      console.warn('Backend not available, using mock confirmation');
      return { success: true };
    }
    throw new Error(error.message || 'Failed to confirm payment');
  }
};

/**
 * Get Stripe Connect account status
 */
export const getStripeConnectAccount = async (
  hostId: string
): Promise<StripeConnectAccount | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/connect/account/${hostId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to get Stripe Connect account');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting Stripe Connect account:', error);
    throw error;
  }
};

/**
 * Create Stripe Connect account onboarding link
 */
export const createStripeConnectOnboarding = async (
  hostId: string,
  returnUrl: string
): Promise<{ onboardingUrl: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/connect/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ hostId, returnUrl }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create onboarding' }));
      throw new Error(error.message || 'Failed to create onboarding');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Stripe Connect onboarding:', error);
    throw error;
  }
};

/**
 * Get Stripe Connect OAuth URL
 */
export const getStripeConnectOAuthUrl = async (hostId: string, returnUrl: string): Promise<string> => {
  try {
    // Try to get OAuth URL from backend
    const response = await fetch(`${API_BASE_URL}/stripe-connect/oauth-url?hostId=${hostId}&returnUrl=${encodeURIComponent(returnUrl)}`);
    if (response.ok) {
      const data = await response.json();
      return data.oauthUrl;
    }
  } catch (error) {
    console.warn('Backend OAuth URL not available, using direct method');
  }

  // Fallback to direct method
  if (!STRIPE_CONNECT_CLIENT_ID) {
    throw new Error('Stripe Connect Client ID is not configured. Please wait for account verification and add VITE_STRIPE_CONNECT_CLIENT_ID to your environment variables.');
  }

  const baseUrl = 'https://connect.stripe.com/oauth/authorize';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: STRIPE_CONNECT_CLIENT_ID,
    scope: 'read_write',
    redirect_uri: returnUrl,
    state: hostId, // Use hostId as state for security
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Handle Stripe Connect OAuth callback
 */
export const handleStripeConnectCallback = async (
  code: string,
  state: string
): Promise<StripeConnectAccount> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe-connect/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to connect Stripe account' }));
      throw new Error(error.error || 'Failed to connect Stripe account');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error handling Stripe Connect callback:', error);
    throw error;
  }
};

/**
 * Disconnect Stripe Connect account
 */
export const disconnectStripeAccount = async (hostId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/connect/disconnect/${hostId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to disconnect account' }));
      throw new Error(error.message || 'Failed to disconnect account');
    }
  } catch (error) {
    console.error('Error disconnecting Stripe account:', error);
    throw error;
  }
};
