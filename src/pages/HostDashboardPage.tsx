import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useAvailability } from '../hooks/useAvailability';
import { useStripeConnect } from '../hooks/useStripeConnect';

const HostDashboardPage = () => {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const { chargers: availableChargers, updateAvailability } = useAvailability();
  const { isConnected } = useStripeConnect(user?.id);
  
  // Get chargers owned by this host
  const myChargers = availableChargers.filter(
    (c) => c.hostId === user?.id || c.hostId === `host${user?.id}` ||
    (user?.email === 'demo@plugspot.com' && ['1', '2'].includes(c.id))
  );

  // Get bookings for my chargers
  const myBookings = bookings.filter((b) =>
    myChargers.some((c) => c.id === b.chargerId)
  );

  const totalEarnings = myBookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.hostEarnings || b.totalCost - (b.platformFee || 0)), 0);

  const upcomingBookings = myBookings.filter((b) => b.status === 'upcoming');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-heading font-bold mb-8 text-gray-100">Host Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
                <p className="text-3xl font-bold text-electric-green">${totalEarnings.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Paid directly to your Stripe account</p>
                <div className="mt-3 flex items-center gap-2">
                  {isConnected ? (
                    <span className="text-xs text-electric-green">✓ Stripe Connected</span>
                  ) : (
                    <Link
                      to="/stripe-connect"
                      className="text-xs text-electric-green hover:underline"
                    >
                      Connect Stripe →
                    </Link>
                  )}
                </div>
              </div>
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-2">My Chargers</p>
                <p className="text-3xl font-bold text-gray-100">{myChargers.length}</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-2">Upcoming Bookings</p>
                <p className="text-3xl font-bold text-gray-100">{upcomingBookings.length}</p>
              </div>
            </div>

            {/* My Chargers */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">My Chargers</h2>
              {myChargers.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <p className="text-gray-400 mb-4">You haven't listed any chargers yet.</p>
                  <Link
                    to="/list-charger"
                    className="inline-block px-6 py-3 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all"
                  >
                    List Your First Charger
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex justify-end">
                    <Link
                      to="/list-charger"
                      className="px-4 py-2 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all text-sm"
                    >
                      + Add New Charger
                    </Link>
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myChargers.map((charger) => (
                    <ChargerManagementCard
                      key={charger.id}
                      charger={charger}
                      updateAvailability={updateAvailability}
                    />
                  ))}
                </div>
                </>
              )}
            </div>

            {/* Recent Bookings */}
            <div>
              <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">
                Recent Bookings
              </h2>
              {myBookings.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <p className="text-gray-400">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.userAvatar}
                            alt={booking.userName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-100">{booking.userName}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(booking.startTime).toLocaleDateString()} • {booking.duration}h
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-electric-green">
                            ${(booking.hostEarnings || booking.totalCost - (booking.platformFee || 0)).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Total: ${booking.totalCost.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-400 capitalize">{booking.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const ChargerManagementCard: React.FC<{
  charger: any;
  updateAvailability: (id: string, available: boolean) => void;
}> = ({ charger, updateAvailability }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="mb-4">
        <h3 className="font-semibold text-gray-100 mb-1">{charger.address}</h3>
        <p className="text-sm text-gray-400">{charger.city}</p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="px-2 py-1 bg-electric-green/20 text-electric-green rounded text-xs font-medium">
          {charger.connector}
        </span>
        <span className="text-sm text-gray-400">{charger.powerKW} kW</span>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={charger.available}
            onChange={(e) => updateAvailability(charger.id, e.target.checked)}
            className="w-4 h-4 text-electric-green bg-gray-800 border-gray-600 rounded focus:ring-electric-green"
          />
          <span className="text-sm text-gray-300">
            {charger.available ? 'Available' : 'Unavailable'}
          </span>
        </label>
      </div>

      <p className="text-sm text-gray-400">
        ${charger.pricePerKwh.toFixed(2)}/kWh • ${charger.accessFee.toFixed(2)} access fee
      </p>
    </motion.div>
  );
};

export default HostDashboardPage;
