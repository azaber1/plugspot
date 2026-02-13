import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
// import { useAuth } from '../contexts/AuthContext'; // Not used
import { useBookings } from '../hooks/useBookings';
import { formatDateTime } from '../utils/scheduling';
import { Booking } from '../types';

const BookingConfirmationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  // const { user } = useAuth(); // Not used in this component
  const { bookings, cancelBooking } = useBookings();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get booking from navigation state first
    const bookingFromState = (location.state as { booking?: Booking })?.booking;
    if (bookingFromState) {
      setBooking(bookingFromState);
      setLoading(false);
      return;
    }

    // Then try from bookings store
    const bookingFromStore = bookings.find((b) => b.id === id);
    if (bookingFromStore) {
      setBooking(bookingFromStore);
      setLoading(false);
      return;
    }

    // If not found, try reading directly from localStorage (in case state hasn't updated)
    try {
      const stored = localStorage.getItem('plugspot_bookings');
      if (stored) {
        const allBookings: Booking[] = JSON.parse(stored);
        const foundBooking = allBookings.find((b) => b.id === id);
        if (foundBooking) {
          setBooking(foundBooking);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }

    setLoading(false);
  }, [id, bookings, location.state]);

  if (loading || !booking) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 pt-24">
          <Navbar />
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="glass-card p-8 max-w-md mx-auto">
              <div className="animate-spin w-12 h-12 border-4 border-electric-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-xl text-gray-400 mb-4">Loading booking details...</p>
              {!loading && !booking && (
                <>
                  <p className="text-sm text-gray-500 mb-4">Booking not found.</p>
                  <Link to="/bookings" className="text-electric-green hover:underline">
                    View My Bookings
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      cancelBooking(booking.id);
      navigate('/bookings');
    }
  };

  const canCancel = booking.status === 'upcoming' && new Date(booking.startTime) > new Date();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-electric-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✓</span>
              </div>
              <h1 className="text-3xl font-heading font-bold text-gray-100 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-gray-400">Your booking has been successfully created</p>
            </div>

            {/* Booking Details */}
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={booking.charger.host.avatar}
                    alt={booking.charger.host.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-100">{booking.charger.host.name}</h3>
                    <p className="text-sm text-gray-400">{booking.charger.address}</p>
                    <p className="text-sm text-gray-500">{booking.charger.city}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Start Time</p>
                  <p className="text-gray-100 font-medium">
                    {formatDateTime(new Date(booking.startTime))}
                  </p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">End Time</p>
                  <p className="text-gray-100 font-medium">
                    {formatDateTime(new Date(booking.endTime))}
                  </p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Duration</p>
                  <p className="text-gray-100 font-medium">{booking.duration} hours</p>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Total Cost</p>
                  <p className="text-electric-green font-semibold text-lg">
                    ${booking.totalCost.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Charger Details</p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Connector:</span> {booking.charger.connector}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Power:</span> {booking.charger.powerKW} kW
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Price:</span> ${booking.charger.pricePerKwh.toFixed(2)}/kWh
                  </p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Payment Breakdown</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Energy Cost</span>
                    <span>${booking.energyCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Access Fee</span>
                    <span>${booking.accessFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${(booking.energyCost + booking.accessFee).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-xs pt-1 border-t border-gray-700">
                    <span>Platform Service Fee (12%)</span>
                    <span>${(booking.platformFee || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-electric-green font-semibold pt-1 border-t border-gray-700">
                    <span>Total Paid</span>
                    <span>${booking.totalCost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500">
                    💰 Payment automatically split: ${(booking.hostEarnings || 0).toFixed(2)} to host, ${(booking.platformFee || 0).toFixed(2)} platform commission
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                to="/bookings"
                className="flex-1 px-6 py-3 glass-card text-gray-300 rounded-lg text-center font-medium hover:border-electric-green/50 transition-all"
              >
                View All Bookings
              </Link>
              <Link
                to={`/charger/${booking.chargerId}`}
                className="flex-1 px-6 py-3 glass-card text-gray-300 rounded-lg text-center font-medium hover:border-electric-green/50 transition-all"
              >
                View Charger
              </Link>
            </div>

            {canCancel && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={handleCancel}
                  className="w-full px-6 py-3 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-all"
                >
                  Cancel Booking
                </button>
              </div>
            )}

            <div className="mt-6 p-4 bg-electric-green/10 border border-electric-green/30 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Booking ID:</span> {booking.id}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                A confirmation has been sent to your account. You can view and manage this booking from your bookings page.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BookingConfirmationPage;
