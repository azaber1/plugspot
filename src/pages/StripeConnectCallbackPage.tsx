import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useStripeConnect } from '../hooks/useStripeConnect';
import { useToast } from '../components/ToastContext';

const StripeConnectCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { handleOAuthCallback } = useStripeConnect(user?.id);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      // Handle OAuth error
      if (errorParam) {
        setStatus('error');
        setError('Stripe connection was cancelled or failed');
        showToast('Failed to connect Stripe account', 'error');
        setTimeout(() => navigate('/stripe-connect'), 3000);
        return;
      }

      // Validate required parameters
      if (!code || !state) {
        setStatus('error');
        setError('Invalid callback parameters');
        showToast('Invalid connection request', 'error');
        setTimeout(() => navigate('/stripe-connect'), 3000);
        return;
      }

      // Verify state matches current user
      if (state !== user?.id) {
        setStatus('error');
        setError('Security validation failed');
        showToast('Security validation failed', 'error');
        setTimeout(() => navigate('/stripe-connect'), 3000);
        return;
      }

      try {
        // Handle the OAuth callback
        await handleOAuthCallback(code, state);
        
        setStatus('success');
        showToast('Stripe account connected successfully!', 'success');
        
        // Redirect to payment settings after 2 seconds
        setTimeout(() => {
          navigate('/stripe-connect');
        }, 2000);
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Failed to connect Stripe account');
        showToast(err.message || 'Failed to connect Stripe account', 'error');
        
        setTimeout(() => {
          navigate('/stripe-connect');
        }, 3000);
      }
    };

    if (user) {
      processCallback();
    } else {
      navigate('/login');
    }
  }, [searchParams, user, handleOAuthCallback, navigate, showToast]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-card p-8 text-center">
              {status === 'loading' && (
                <>
                  <div className="animate-spin w-12 h-12 border-4 border-electric-green border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-2">
                    Connecting Stripe Account
                  </h2>
                  <p className="text-gray-400">Please wait while we connect your account...</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="w-16 h-16 bg-electric-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-electric-green"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-2">
                    Successfully Connected!
                  </h2>
                  <p className="text-gray-400 mb-4">
                    Your Stripe account has been connected successfully.
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirecting to payment settings...
                  </p>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-2">
                    Connection Failed
                  </h2>
                  <p className="text-gray-400 mb-4">
                    {error || 'Failed to connect your Stripe account'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirecting back to payment settings...
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StripeConnectCallbackPage;
