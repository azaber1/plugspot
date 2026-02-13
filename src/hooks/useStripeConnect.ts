import { useState, useEffect } from 'react';
import { StripeAccount } from '../types';
import {
  getStripeConnectAccount,
  createStripeConnectOnboarding,
  getStripeConnectOAuthUrl,
  handleStripeConnectCallback,
  disconnectStripeAccount as disconnectAccount,
} from '../services/stripeService';

const STRIPE_ACCOUNTS_KEY = 'plugspot_stripe_accounts';

export const useStripeConnect = (hostId?: string) => {
  const [account, setAccount] = useState<StripeAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load account from API
  useEffect(() => {
    if (!hostId) {
      setLoading(false);
      return;
    }

    const loadAccount = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get from API first
        const apiAccount = await getStripeConnectAccount(hostId);
        
        if (apiAccount) {
          // Convert API response to local format
          const localAccount: StripeAccount = {
            hostId,
            accountId: apiAccount.accountId,
            email: apiAccount.email,
            isConnected: apiAccount.isActive && apiAccount.chargesEnabled,
            connectedAt: new Date().toISOString(),
          };
          setAccount(localAccount);
          
          // Also save to localStorage as backup
          try {
            const stored = localStorage.getItem(STRIPE_ACCOUNTS_KEY);
            const accounts: StripeAccount[] = stored ? JSON.parse(stored) : [];
            const updated = accounts.filter((a) => a.hostId !== hostId);
            updated.push(localAccount);
            localStorage.setItem(STRIPE_ACCOUNTS_KEY, JSON.stringify(updated));
          } catch (e) {
            console.warn('Failed to save to localStorage:', e);
          }
        } else {
          // Fallback to localStorage for demo/offline mode
          try {
            const stored = localStorage.getItem(STRIPE_ACCOUNTS_KEY);
            const accounts: StripeAccount[] = stored ? JSON.parse(stored) : [];
            const localAccount = accounts.find((a) => a.hostId === hostId);
            setAccount(localAccount || null);
          } catch (e) {
            console.warn('Failed to load from localStorage:', e);
          }
        }
      } catch (err: any) {
        console.error('Error loading Stripe account:', err);
        setError(err.message || 'Failed to load Stripe account');
        
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem(STRIPE_ACCOUNTS_KEY);
          const accounts: StripeAccount[] = stored ? JSON.parse(stored) : [];
          const localAccount = accounts.find((a) => a.hostId === hostId);
          setAccount(localAccount || null);
        } catch (e) {
          // Ignore localStorage errors
        }
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [hostId]);

  const connectStripeAccount = async (returnUrl: string): Promise<void> => {
    if (!hostId) {
      throw new Error('Host ID is required');
    }

    try {
      setLoading(true);
      setError(null);

      // Use OAuth flow for production
      const oauthUrl = await getStripeConnectOAuthUrl(hostId, returnUrl);
      window.location.href = oauthUrl;
    } catch (err: any) {
      setError(err.message || 'Failed to connect Stripe account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthCallback = async (code: string, state: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const connectedAccount = await handleStripeConnectCallback(code, state);
      
      const localAccount: StripeAccount = {
        hostId: state,
        accountId: connectedAccount.accountId,
        email: connectedAccount.email,
        isConnected: connectedAccount.isActive && connectedAccount.chargesEnabled,
        connectedAt: new Date().toISOString(),
      };

      setAccount(localAccount);

      // Save to localStorage
      try {
        const stored = localStorage.getItem(STRIPE_ACCOUNTS_KEY);
        const accounts: StripeAccount[] = stored ? JSON.parse(stored) : [];
        const updated = accounts.filter((a) => a.hostId !== state);
        updated.push(localAccount);
        localStorage.setItem(STRIPE_ACCOUNTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to handle OAuth callback');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnectStripeAccount = async (): Promise<void> => {
    if (!hostId) {
      throw new Error('Host ID is required');
    }

    try {
      setLoading(true);
      setError(null);

      await disconnectAccount(hostId);
      setAccount(null);

      // Remove from localStorage
      try {
        const stored = localStorage.getItem(STRIPE_ACCOUNTS_KEY);
        const accounts: StripeAccount[] = stored ? JSON.parse(stored) : [];
        const updated = accounts.filter((a) => a.hostId !== hostId);
        localStorage.setItem(STRIPE_ACCOUNTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update localStorage:', e);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect Stripe account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    account,
    loading,
    error,
    isConnected: !!account?.isConnected,
    connectStripeAccount,
    handleOAuthCallback,
    disconnectStripeAccount,
  };
};
