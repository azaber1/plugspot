import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { getStripe } from '../config/stripe';
import { createPaymentIntent, confirmPaymentIntent } from '../services/stripeService';
import { useToast } from './ToastContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // in dollars
  hostStripeAccountId: string;
  chargerId: string;
  bookingId: string;
  onSuccess: () => void;
  onError?: (error: string) => void;
}

const PaymentForm: React.FC<{
  amount: number;
  hostStripeAccountId: string;
  chargerId: string;
  bookingId: string;
  onSuccess: () => void;
  onClose: () => void;
  onError?: (error: string) => void;
}> = ({ amount, hostStripeAccountId, chargerId, bookingId, onSuccess, onClose, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      showToast('Payment system not ready. Please try again.', 'error');
      return;
    }

    setProcessing(true);

    try {
      // Confirm payment with Stripe using PaymentElement
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/${bookingId}/confirm`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm on backend
        await confirmPaymentIntent(paymentIntent.id);
        showToast('Payment successful!', 'success');
        onSuccess();
        onClose();
      } else {
        throw new Error('Payment was not completed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMessage = error.message || 'Payment failed. Please try again.';
      showToast(errorMessage, 'error');
      onError?.(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gray-800/50 rounded-lg">
        <p className="text-gray-400 text-sm mb-1">Total Amount</p>
        <p className="text-3xl font-bold text-electric-green">${amount.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1">
          Platform fee (12%): ${(amount * 0.12).toFixed(2)} • Host receives: ${(amount * 0.88).toFixed(2)}
        </p>
      </div>

      <div>
        <label className="block text-gray-300 mb-2 text-sm">Payment Details</label>
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <PaymentElement 
            options={{
              layout: 'tabs',
            }}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="flex-1 px-4 py-3 glass-card text-gray-300 rounded-lg font-medium hover:border-electric-green/50 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 px-4 py-3 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        🔒 Secure payment powered by Stripe
      </p>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  hostStripeAccountId,
  chargerId,
  bookingId,
  onSuccess,
  onError,
}) => {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Create payment intent when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const createIntent = async () => {
      try {
        setLoading(true);
        
        // Calculate platform commission (12%)
        const subtotal = amount;
        const platformFee = subtotal * 0.12;

        const response = await createPaymentIntent(
          amount, // Amount in dollars (will be converted to cents in service)
          hostStripeAccountId || '',
          chargerId || '',
          bookingId || ''
        );

        setClientSecret(response.clientSecret);
        setStripePromise(getStripe());
      } catch (error: any) {
        console.error('Error creating payment intent:', error);
        const errorMessage = error.message || 'Failed to initialize payment';
        onError?.(errorMessage);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (amount > 0 && hostStripeAccountId) {
      createIntent();
    }
  }, [isOpen, amount, hostStripeAccountId, chargerId, bookingId, onError, onClose]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative glass-card p-8 max-w-md w-full z-10 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="animate-spin w-12 h-12 border-4 border-electric-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Initializing payment...</p>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass-card p-8 max-w-md w-full z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-bold text-gray-100">Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>

          {stripePromise && clientSecret && (
            <Elements 
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#22c55e',
                    colorBackground: '#1f2937',
                    colorText: '#e5e7eb',
                    colorDanger: '#ef4444',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <PaymentForm
                amount={amount}
                hostStripeAccountId={hostStripeAccountId}
                chargerId={chargerId}
                bookingId={bookingId}
                onSuccess={onSuccess}
                onClose={onClose}
                onError={onError}
              />
            </Elements>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
