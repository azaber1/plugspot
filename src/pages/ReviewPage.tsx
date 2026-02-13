import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { chargers } from '../data';
import { useBookings } from '../hooks/useBookings';
import { useReviews } from '../hooks/useReviews';
import { useToast } from '../components/ToastContext';

const ReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { markBookingAsReviewed } = useBookings();
  const { addReview } = useReviews();
  const { showToast } = useToast();

  const charger = chargers.find((c) => c.id === id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!charger) {
      navigate('/browse');
    }
  }, [charger, navigate]);

  if (!charger) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const newReview = {
      id: `review-${Date.now()}`,
      bookingId: bookingId || '',
      chargerId: charger.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    // Save review
    addReview(newReview);

    // Update booking to mark as reviewed
    if (bookingId) {
      markBookingAsReviewed(bookingId);
    }

    showToast('Thank you for your review!', 'success');
    navigate(`/charger/${charger.id}`);
  };

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
            <h1 className="text-3xl font-heading font-bold mb-6 text-gray-100">
              Write a Review
            </h1>

            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Charger Location</p>
              <p className="text-gray-100 font-medium">{charger.address}</p>
              <p className="text-gray-400 text-sm">{charger.city}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-4xl focus:outline-none transition-transform hover:scale-110"
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-2">{rating} out of 5 stars</p>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-electric-green min-h-[150px]"
                  placeholder="Share your experience with this charger..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/charger/${charger.id}`)}
                  className="flex-1 px-4 py-3 glass-card text-gray-300 rounded-lg font-medium hover:border-electric-green/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ReviewPage;
