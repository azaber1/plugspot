import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useToast } from '../components/ToastContext';
import { BookingStatus } from '../types';
import { formatDateTime } from '../utils/scheduling';

const BookingHistoryPage = () => {
  const { user } = useAuth();
  const { getBookingsByUser, cancelBooking } = useBookings();
  const { showToast } = useToast();
  const bookings = user ? getBookingsByUser(user.id) : [];

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400';
      case 'active':
        return 'bg-electric-green/20 text-electric-green';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');
  const activeBookings = bookings.filter((b) => b.status === 'active');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-heading font-bold mb-8 text-gray-100">My Bookings</h1>

            {bookings.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-xl text-gray-400 mb-4">No bookings yet</p>
                <Link
                  to="/browse"
                  className="inline-block px-6 py-3 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all"
                >
                  Browse Chargers
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {upcomingBookings.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">
                      Upcoming
                    </h2>
                    <div className="grid gap-4">
                      {upcomingBookings.map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          getStatusColor={getStatusColor}
                          onCancel={(id) => {
                            cancelBooking(id);
                            showToast('Booking cancelled', 'success');
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeBookings.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">Active</h2>
                    <div className="grid gap-4">
                      {activeBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} getStatusColor={getStatusColor} />
                      ))}
                    </div>
                  </div>
                )}

                {pastBookings.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">Past</h2>
                    <div className="grid gap-4">
                      {pastBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} getStatusColor={getStatusColor} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const BookingCard: React.FC<{
  booking: any;
  getStatusColor: (status: BookingStatus) => string;
  onCancel?: (bookingId: string) => void;
}> = ({ booking, getStatusColor, onCancel }) => {
  const canCancel = booking.status === 'upcoming' && new Date(booking.startTime) > new Date();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={booking.charger.host.avatar}
              alt={booking.charger.host.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-100">{booking.charger.host.name}</h3>
              <p className="text-sm text-gray-400">{booking.charger.address}</p>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-400">Start</p>
          <p className="text-gray-100">{formatDateTime(new Date(booking.startTime))}</p>
        </div>
        <div>
          <p className="text-gray-400">End</p>
          <p className="text-gray-100">{formatDateTime(new Date(booking.endTime))}</p>
        </div>
        <div>
          <p className="text-gray-400">Duration</p>
          <p className="text-gray-100">{booking.duration} hours</p>
        </div>
        <div>
          <p className="text-gray-400">Total</p>
          <p className="text-electric-green font-semibold">${booking.totalCost.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to={`/charger/${booking.chargerId}`}
          className="flex-1 px-4 py-2 glass-card text-gray-300 rounded-lg text-center font-medium hover:border-electric-green/50 transition-all"
        >
          View Charger
        </Link>
        {booking.status === 'completed' && !booking.hasReview && (
          <Link
            to={`/charger/${booking.chargerId}/review?booking=${booking.id}`}
            className="flex-1 px-4 py-2 bg-electric-green text-gray-900 rounded-lg text-center font-semibold hover:shadow-glow-green transition-all"
          >
            Leave Review
          </Link>
        )}
        {canCancel && onCancel && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel this booking?')) {
                onCancel(booking.id);
              }
            }}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-center font-medium hover:bg-red-500/30 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default BookingHistoryPage;
