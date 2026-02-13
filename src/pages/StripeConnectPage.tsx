import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useStripeConnect } from '../hooks/useStripeConnect';
import { useBookings } from '../hooks/useBookings';
import { useAvailability } from '../hooks/useAvailability';
import { useToast } from '../components/ToastContext';
import { formatCurrency } from '../utils/pricing';
import { STRIPE_CONNECT_CLIENT_ID } from '../config/stripe';

const StripeConnectPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { account, connectStripeAccount, disconnectStripeAccount, isConnected } = useStripeConnect(user?.id);
  const { bookings } = useBookings();
  const { chargers } = useAvailability();
  const [isConnecting, setIsConnecting] = useState(false);

  // Get chargers owned by this host
  const myChargers = chargers.filter(
    (c) => c.hostId === user?.id || c.hostId === `host${user?.id}`
  );

  // Calculate total earnings (from completed bookings)
  const totalEarnings = bookings
    .filter((b) => {
      const isMyCharger = myChargers.some((c) => c.id === b.chargerId);
      return isMyCharger && b.status === 'completed';
    })
    .reduce((sum, b) => sum + (b.hostEarnings || b.totalCost - (b.platformFee || 0)), 0);

  // Calculate platform commission
  const platformCommission = bookings
    .filter((b) => {
      const isMyCharger = myChargers.some((c) => c.id === b.chargerId);
      return isMyCharger && b.status === 'completed';
    })
    .reduce((sum, b) => sum + (b.platformFee || 0), 0);

  const handleConnect = async () => {
    if (!user) return;
    
    try {
      setIsConnecting(true);
      
      // Get return URL for OAuth callback
      const returnUrl = `${window.location.origin}/stripe-connect/callback`;
      
      // Redirect to Stripe Connect OAuth
      await connectStripeAccount(returnUrl);
    } catch (error: any) {
      showToast(error.message || 'Failed to connect Stripe account', 'error');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to disconnect your Stripe account? You won\'t be able to receive payments until you reconnect.')) {
      await disconnectStripeAccount();
      showToast('Stripe account disconnected', 'success');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <Link
                to="/dashboard"
                className="text-electric-green hover:underline text-sm mb-4 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-4xl font-heading font-bold text-gray-100">Payment Settings</h1>
              <p className="text-gray-400 mt-2">
                Connect your Stripe account to receive payments directly when guests book your chargers
              </p>
            </div>

            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
                <p className="text-3xl font-bold text-electric-green">
                  {formatCurrency(totalEarnings)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Paid directly to your Stripe account</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-2">Platform Commission</p>
                <p className="text-3xl font-bold text-gray-100">
                  {formatCurrency(platformCommission)}
                </p>
                <p className="text-xs text-gray-500 mt-1">12% automatically deducted</p>
              </div>
            </div>

            {/* Stripe Connection */}
            <div className="glass-card p-8">
              {!STRIPE_CONNECT_CLIENT_ID && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm text-yellow-400">
                    ⏳ <strong>Stripe Account Verification:</strong> Your account is being verified. 
                    Stripe Connect will be available in 24-48 hours. You can still use the app for everything else!
                  </p>
                </div>
              )}
              {isConnected && account ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-2">
                        Stripe Account Connected
                      </h2>
                      <p className="text-gray-400">
                        Account: {account.email}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Connected on {new Date(account.connectedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-electric-green/20 text-electric-green rounded-full text-sm font-medium">
                        ✓ Connected
                      </span>
                    </div>
                  </div>

                  <div className="bg-electric-green/10 border border-electric-green/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-300">
                      <strong>How it works:</strong> When guests book your chargers, payments are automatically split:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-400 mt-2 space-y-1">
                      <li>88% goes directly to your Stripe account</li>
                      <li>12% goes to the platform as commission</li>
                      <li>No manual payouts needed - it's automatic!</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleDisconnect}
                    className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all"
                  >
                    Disconnect Stripe Account
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-2">
                      Connect Your Stripe Account
                    </h2>
                    <p className="text-gray-400 mb-6">
                      Connect your Stripe account to start receiving payments automatically when guests book your chargers.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold text-gray-100 mb-3">Benefits:</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-electric-green mt-1">✓</span>
                        <span>Automatic payments - money goes directly to your account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-electric-green mt-1">✓</span>
                        <span>No manual payouts - instant transfers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-electric-green mt-1">✓</span>
                        <span>Secure and reliable - powered by Stripe</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-electric-green mt-1">✓</span>
                        <span>Platform commission (12%) automatically deducted</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleConnect}
                    disabled={isConnecting || !STRIPE_CONNECT_CLIENT_ID}
                    className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                      isConnecting || !STRIPE_CONNECT_CLIENT_ID
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-electric-green text-gray-900 hover:shadow-glow-green'
                    }`}
                  >
                    {isConnecting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full"></span>
                        Connecting...
                      </span>
                    ) : !STRIPE_CONNECT_CLIENT_ID ? (
                      'Waiting for Account Verification...'
                    ) : (
                      'Connect Stripe Account'
                    )}
                  </button>

                  <p className="text-xs text-gray-500 mt-4">
                    {!STRIPE_CONNECT_CLIENT_ID 
                      ? 'Stripe Connect will be available after account verification (24-48 hours).'
                      : 'By connecting, you agree to Stripe\'s terms of service. In production, this would redirect to Stripe Connect OAuth.'}
                  </p>
                </div>
              )}
            </div>

            {/* How It Works */}
            {isConnected && (
              <div className="glass-card p-6 mt-8">
                <h3 className="text-xl font-heading font-semibold text-gray-100 mb-4">
                  Payment Flow
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-electric-green/20 text-electric-green flex items-center justify-center font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-100">Guest Books Your Charger</p>
                      <p className="text-sm text-gray-400">Guest selects a time slot and completes payment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-electric-green/20 text-electric-green flex items-center justify-center font-semibold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-100">Automatic Split Payment</p>
                      <p className="text-sm text-gray-400">
                        Payment is automatically split: 88% to you, 12% platform commission
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-electric-green/20 text-electric-green flex items-center justify-center font-semibold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-100">Money in Your Account</p>
                      <p className="text-sm text-gray-400">
                        Your share goes directly to your connected Stripe account
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StripeConnectPage;
