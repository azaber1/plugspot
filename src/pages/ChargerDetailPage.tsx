import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { chargers } from '../data';
import { useToast } from '../components/ToastContext';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useReviews } from '../hooks/useReviews';
import { useAvailability } from '../hooks/useAvailability';
import { useStripeConnect } from '../hooks/useStripeConnect';
import { calculateAvailability, formatNextAvailableTime, formatDateTime, hasBookingConflict } from '../utils/scheduling';
import { calculateBookingCost } from '../utils/pricing';
import ScheduleView from '../components/ScheduleView';
import TimeSlotPicker from '../components/TimeSlotPicker';
import PaymentModal from '../components/PaymentModal';
import { sendEmail, emailTemplates } from '../services/emailService';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

const durationOptions = [1, 2, 4, 8];

const ChargerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user, isAuthenticated } = useAuth();
  const { addBooking, getBookingsByUser, bookings } = useBookings();
  const { getReviewsByCharger, hasUserReviewedCharger } = useReviews();
  const { chargers: availableChargers } = useAvailability();
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const charger = availableChargers.find((c) => c.id === id) || chargers.find((c) => c.id === id);
  const { account: hostStripeAccount } = useStripeConnect(charger?.hostId);
  
  // Calculate real-time availability
  const availabilityInfo = charger ? calculateAvailability(charger, bookings) : null;

  if (!charger) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24">
        <Navbar />
        <div className="container mx-auto px-4 text-center py-20">
          <p className="text-xl text-gray-400">Charger not found</p>
          <Link to="/browse" className="text-electric-green hover:underline mt-4 inline-block">
            Browse Chargers
          </Link>
        </div>
      </div>
    );
  }

  const calculateCost = () => {
    return calculateBookingCost(charger, selectedDuration);
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedTime) {
      showToast('Please select a time slot', 'error');
      return;
    }

    // Validate booking doesn't conflict
    const startTime = new Date(selectedTime);
    const endTime = new Date(startTime.getTime() + selectedDuration * 60 * 60 * 1000);

    if (hasBookingConflict(charger.id, startTime, endTime, bookings)) {
      showToast('This time slot is no longer available. Please select another time.', 'error');
      return;
    }

    // Check if time is in the past
    if (startTime < new Date()) {
      showToast('Cannot book in the past. Please select a future time.', 'error');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (!user || !charger || !selectedTime) return;

    const costBreakdown = calculateCost();
    const startTime = new Date(selectedTime);
    const endTime = new Date(startTime.getTime() + selectedDuration * 60 * 60 * 1000);

    // Final conflict check before creating booking
    if (hasBookingConflict(charger.id, startTime, endTime, bookings)) {
      showToast('This time slot was just booked by someone else. Please select another time.', 'error');
      setShowPaymentModal(false);
      return;
    }

    // In production, this would use Stripe Connect to split the payment:
    // - Charge the guest the full amount
    // - Automatically transfer hostEarnings to host's Stripe account
    // - Platform keeps platformFee as commission
    // For demo, we just record the booking

    const booking = {
      id: `booking-${Date.now()}`,
      chargerId: charger.id,
      charger: charger,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: selectedDuration,
      status: 'upcoming' as const,
      totalCost: costBreakdown.total,
      energyCost: costBreakdown.energyCost,
      accessFee: costBreakdown.accessFee,
      platformFee: costBreakdown.platformFee,
      hostEarnings: costBreakdown.hostEarnings,
      createdAt: new Date().toISOString(),
      hasReview: false,
    };

    addBooking(booking);
    showToast(
      `Booking confirmed! $${costBreakdown.hostEarnings.toFixed(2)} sent to host, $${costBreakdown.platformFee.toFixed(2)} platform commission.`,
      'success'
    );
    
    // Send email notifications
    const guestEmail = user.email;
    // Try to get host email from user data if available, otherwise use fallback
    const hostEmail = `host-${charger.hostId}@plugspot.com`; // In production, fetch from user database
    
    // Send confirmation to guest
    sendEmail({
      to: guestEmail,
      ...emailTemplates.bookingConfirmationGuest({
        chargerAddress: `${charger.address}, ${charger.city}`,
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalCost: booking.totalCost,
        bookingId: booking.id,
      }),
    });

    // Send notification to host
    sendEmail({
      to: hostEmail,
      ...emailTemplates.bookingConfirmationHost({
        guestName: user.name,
        chargerAddress: `${charger.address}, ${charger.city}`,
        startTime: booking.startTime,
        endTime: booking.endTime,
        hostEarnings: booking.hostEarnings,
        bookingId: booking.id,
      }),
    });

    // Send payment receipt
    sendEmail({
      to: guestEmail,
      ...emailTemplates.paymentReceipt({
        bookingId: booking.id,
        totalCost: booking.totalCost,
        date: booking.createdAt,
      }),
    });
    
    // Wait a moment for state to update, then navigate with booking data
    setTimeout(() => {
      navigate(`/booking/${booking.id}/confirm`, { state: { booking } });
    }, 100);
  };

  const costs = calculateCost();

  // Combine static reviews with user reviews
  const chargerUserReviews = getReviewsByCharger(charger.id);
  const allReviews = [...(charger.reviews || []), ...chargerUserReviews];

  // Check if user has a completed booking for this charger
  const userBookings = user ? getBookingsByUser(user.id) : [];
  const hasCompletedBooking = userBookings.some(
    (b) => b.chargerId === charger.id && b.status === 'completed'
  );
  const canLeaveReview = isAuthenticated && hasCompletedBooking && !hasUserReviewedCharger(user?.id || '', charger.id);

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <Navbar />
      
      <div className="container mx-auto px-4 pb-20">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-electric-green transition-colors flex items-center gap-2"
        >
          ← Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={charger.host.avatar}
                  alt={charger.host.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-heading font-bold text-gray-100">
                      {charger.host.name}
                    </h2>
                    {charger.host.verified && (
                      <span className="text-electric-green text-sm bg-electric-green/20 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                    <button
                      onClick={() => {
                        toggleFavorite(charger.id);
                        showToast(
                          isFavorite(charger.id)
                            ? 'Removed from favorites'
                            : 'Added to favorites',
                          'success'
                        );
                      }}
                      className="ml-auto p-2 glass-card rounded-lg hover:border-electric-green/60 transition-all"
                      aria-label={isFavorite(charger.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <span className={`text-2xl ${isFavorite(charger.id) ? 'text-electric-green' : 'text-gray-400'}`}>
                        {isFavorite(charger.id) ? '❤️' : '🤍'}
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>★ {charger.host.rating}</span>
                    <span>•</span>
                    <span>{charger.host.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Photos */}
            {charger.photos && charger.photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-heading font-semibold mb-4 text-gray-100">
                  Photos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {charger.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Charger photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-700 hover:border-electric-green transition-colors cursor-pointer"
                      onClick={() => window.open(photo, '_blank')}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Charger Specs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-heading font-semibold mb-4 text-gray-100">
                Charger Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Connector Type</p>
                  <p className="text-gray-100 font-medium">{charger.connector}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Power Level</p>
                  <p className="text-gray-100 font-medium">{charger.powerKW} kW</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Price per kWh</p>
                  <p className="text-gray-100 font-medium">${charger.pricePerKwh.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Access Fee</p>
                  <p className="text-gray-100 font-medium">${charger.accessFee.toFixed(2)}</p>
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              {...fadeUp}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-heading font-semibold mb-4 text-gray-100">
                Location
              </h3>
              <p className="text-gray-300 font-medium mb-1">{charger.address}</p>
              <p className="text-gray-500 mb-4">{charger.city} • {charger.distance} miles away</p>
              <button
                onClick={() => {
                  const address = encodeURIComponent(`${charger.address}, ${charger.city}`);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                }}
                className="px-4 py-2 bg-electric-green/20 text-electric-green rounded-lg font-medium hover:bg-electric-green/30 transition-all text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Get Directions
              </button>
            </motion.div>

            {/* Amenities */}
            <motion.div
              {...fadeUp}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-heading font-semibold mb-4 text-gray-100">
                Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {charger.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            {charger.description && (
              <motion.div
                {...fadeUp}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-heading font-semibold mb-4 text-gray-100">
                  About This Charger
                </h3>
                <p className="text-gray-300">{charger.description}</p>
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div
              {...fadeUp}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-semibold text-gray-100">
                  Reviews ({allReviews.length})
                </h3>
                {canLeaveReview && (
                  <Link
                    to={`/charger/${charger.id}/review`}
                    className="px-4 py-2 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all text-sm"
                  >
                    Leave Review
                  </Link>
                )}
              </div>
              {allReviews.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-6">
                  {allReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-700 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-100">{review.userName}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </span>
                          <span>•</span>
                          <span>{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 sticky top-32"
            >
              <h3 className="text-xl font-heading font-semibold mb-6 text-gray-100">
                Book This Charger
              </h3>

              {/* Availability Status */}
              <div className="mb-6 space-y-3">
                {availabilityInfo?.isAvailable ? (
                  <div>
                    <span className="inline-block px-3 py-1 bg-electric-green/20 text-electric-green rounded-full text-sm font-medium mb-2">
                      Available Now
                    </span>
                    {availabilityInfo.nextAvailableTime && (
                      <p className="text-sm text-gray-400 mt-2">
                        Next booking starts: {formatDateTime(availabilityInfo.nextAvailableTime)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-2">
                      Currently In Use
                    </span>
                    {availabilityInfo?.nextAvailableTime && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-400">
                          {formatNextAvailableTime(availabilityInfo.nextAvailableTime)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Available at: {formatDateTime(availabilityInfo.nextAvailableTime)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {(availabilityInfo?.currentBooking || (availabilityInfo?.upcomingBookings && availabilityInfo.upcomingBookings.length > 0)) && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-2 font-medium">Schedule:</p>
                    <ScheduleView 
                      bookings={[
                        ...(availabilityInfo?.currentBooking ? [availabilityInfo.currentBooking] : []),
                        ...(availabilityInfo?.upcomingBookings || [])
                      ]} 
                      currentTime={new Date()} 
                    />
                  </div>
                )}
              </div>

              {/* Duration Selector */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-3">Duration</p>
                <div className="grid grid-cols-4 gap-2">
                  {durationOptions.map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => {
                        setSelectedDuration(hours);
                        setSelectedTime(null); // Reset time when duration changes
                      }}
                      className={`py-2 rounded-lg font-medium transition-all ${
                        selectedDuration === hours
                          ? 'bg-electric-green text-gray-900 shadow-glow-green-sm'
                          : 'glass-card text-gray-300 hover:border-electric-green/50'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Picker */}
              <div className="mb-6">
                <TimeSlotPicker
                  charger={charger}
                  allBookings={bookings}
                  duration={selectedDuration}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateChange={setSelectedDate}
                  onTimeSelect={setSelectedTime}
                />
              </div>

              {/* Cost Breakdown */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Energy ({charger.powerKW} kW × {selectedDuration}h × ${charger.pricePerKwh.toFixed(2)})</span>
                  <span>${costs.energyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Access Fee</span>
                  <span>${costs.accessFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>${costs.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs pt-1 border-t border-gray-700">
                  <span>Platform Service Fee (12%)</span>
                  <span>${costs.platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between">
                  <span className="font-semibold text-gray-100">Total</span>
                  <span className="font-semibold text-electric-green text-lg">
                    ${costs.total.toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 mt-2 text-xs text-gray-500 border-t border-gray-800">
                  Host receives: ${costs.hostEarnings.toFixed(2)}
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!availabilityInfo?.isAvailable || !selectedTime}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                  availabilityInfo?.isAvailable && selectedTime
                    ? 'bg-electric-green text-gray-900 hover:shadow-glow-green'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {!selectedTime
                  ? 'Select a Time Slot'
                  : availabilityInfo?.isAvailable
                  ? 'Book Now'
                  : 'Not Available'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {charger && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={costs.total}
          hostStripeAccountId={hostStripeAccount?.accountId || charger.hostId}
          chargerId={charger.id}
          bookingId={`booking-${Date.now()}`}
          onSuccess={handlePaymentSuccess}
          onError={(error) => {
            showToast(error, 'error');
            setShowPaymentModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ChargerDetailPage;
