import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { usePlatformEarnings } from '../hooks/usePlatformEarnings';

const PlatformDashboardPage = () => {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const { getEarningsFromBookings } = usePlatformEarnings();

  // Only allow demo user or admin to access
  const isAdmin = user?.email === 'demo@plugspot.com' || user?.email === 'admin@plugspot.com';

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 pt-24">
          <Navbar />
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="glass-card p-8 max-w-md mx-auto">
              <p className="text-xl text-gray-400 mb-4">Access Denied</p>
              <p className="text-gray-500">This page is only available to platform administrators.</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalPlatformEarnings = getEarningsFromBookings(bookings);
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalCost, 0);
  const totalHostPayouts = completedBookings.reduce((sum, b) => sum + (b.hostEarnings || 0), 0);

  // Calculate earnings by month
  const monthlyEarnings = completedBookings.reduce((acc, booking) => {
    const date = new Date(booking.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = 0;
    }
    acc[monthKey] += booking.platformFee || 0;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-heading font-bold mb-8 text-gray-100">Platform Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-2">Total Platform Earnings</p>
                <p className="text-3xl font-bold text-electric-green">${totalPlatformEarnings.toFixed(2)}</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-2">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-100">{totalBookings}</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-100">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-gray-400 text-sm mb-2">Host Payouts</p>
                <p className="text-3xl font-bold text-gray-100">${totalHostPayouts.toFixed(2)}</p>
              </div>
            </div>

            {/* Monthly Earnings */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">
                Monthly Earnings
              </h2>
              <div className="glass-card p-6">
                {Object.keys(monthlyEarnings).length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No earnings data yet</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(monthlyEarnings)
                      .sort((a, b) => b[0].localeCompare(a[0]))
                      .map(([month, earnings]) => (
                        <div
                          key={month}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                        >
                          <span className="text-gray-300 font-medium">
                            {new Date(month + '-01').toLocaleDateString('en-US', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-electric-green font-semibold">
                            ${earnings.toFixed(2)}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Bookings */}
            <div>
              <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">
                Recent Bookings
              </h2>
              <div className="glass-card p-6">
                {completedBookings.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No completed bookings yet</p>
                ) : (
                  <div className="space-y-4">
                    {completedBookings.slice(0, 10).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.userAvatar}
                            alt={booking.userName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-100">{booking.userName}</p>
                            <p className="text-sm text-gray-400">
                              {booking.charger.address} • {formatDateTime(new Date(booking.startTime))}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-electric-green font-semibold">
                            +${(booking.platformFee || 0).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Host: ${(booking.hostEarnings || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// Helper function
const formatDateTime = (date: Date): string => {
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default PlatformDashboardPage;
