import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useChargers } from '../hooks/useChargers';
import { useToast } from '../components/ToastContext';
import { ConnectorType } from '../types';
import ImageUpload from '../components/ImageUpload';

const AMENITY_OPTIONS = [
  'WiFi',
  'Restroom Access',
  'Covered Parking',
  '24/7 Access',
  'Security Camera',
  'Nearby Coffee Shop',
  'Nearby Shopping',
  'EV Parking Only',
];

const ListChargerPage = () => {
  const { user } = useAuth();
  const { addCharger } = useChargers();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    connector: 'J1772' as ConnectorType,
    powerKW: 7.2,
    pricePerKwh: 0.18,
    accessFee: 2.0,
    description: '',
    amenities: [] as string[],
    photos: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.address.trim()) {
      showToast('Please enter an address', 'error');
      return;
    }
    if (!formData.city.trim()) {
      showToast('Please enter a city', 'error');
      return;
    }
    if (formData.powerKW < 3 || formData.powerKW > 22) {
      showToast('Power must be between 3 and 22 kW', 'error');
      return;
    }
    if (formData.pricePerKwh < 0.10 || formData.pricePerKwh > 1.00) {
      showToast('Price per kWh must be between $0.10 and $1.00', 'error');
      return;
    }
    if (formData.accessFee < 0 || formData.accessFee > 10) {
      showToast('Access fee must be between $0 and $10', 'error');
      return;
    }

    setLoading(true);

    try {
      // Simulate geocoding delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate coordinates (in real app, use geocoding API)
      // DMV area: DC, Maryland, Virginia
      const baseLat = 38.9072;
      const baseLng = -77.0369;
      const lat = baseLat + (Math.random() - 0.5) * 0.1;
      const lng = baseLng + (Math.random() - 0.5) * 0.1;

      const newCharger = {
      id: `charger-${Date.now()}`,
      hostId: user!.id,
      host: {
        name: user!.name,
        avatar: user!.avatar,
        rating: 0,
        reviewCount: 0,
        verified: true, // New hosts start as verified
      },
      address: formData.address,
      city: formData.city,
      latitude: lat,
      longitude: lng,
      distance: Math.random() * 10, // Random distance for demo
      connector: formData.connector,
      powerKW: formData.powerKW,
      pricePerKwh: formData.pricePerKwh,
      accessFee: formData.accessFee,
      amenities: formData.amenities,
      available: true,
      description: formData.description,
      photos: formData.photos,
      reviews: [],
    };

      addCharger(newCharger);
      showToast('Charger listed successfully!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast('Failed to list charger. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <h1 className="text-3xl font-heading font-bold mb-6 text-gray-100">
              List Your Charger
            </h1>
            <p className="text-gray-400 mb-8">
              Share your EV charger with the community and earn money while helping drivers charge up.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location */}
              <div>
                <h2 className="text-xl font-heading font-semibold mb-4 text-gray-100">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Street Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-electric-green"
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-electric-green"
                      placeholder="Oakland"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Charger Specs */}
              <div>
                <h2 className="text-xl font-heading font-semibold mb-4 text-gray-100">
                  Charger Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Connector Type *</label>
                    <select
                      value={formData.connector}
                      onChange={(e) =>
                        setFormData({ ...formData, connector: e.target.value as ConnectorType })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-electric-green"
                      required
                    >
                      <option value="J1772">J1772</option>
                      <option value="Tesla NACS">Tesla NACS</option>
                      <option value="CCS">CCS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Power (kW) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="3"
                      max="22"
                      value={formData.powerKW}
                      onChange={(e) =>
                        setFormData({ ...formData, powerKW: parseFloat(e.target.value) })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-electric-green"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-xl font-heading font-semibold mb-4 text-gray-100">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Price per kWh ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.10"
                      max="1.00"
                      value={formData.pricePerKwh}
                      onChange={(e) =>
                        setFormData({ ...formData, pricePerKwh: parseFloat(e.target.value) })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-electric-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Access Fee ($) *</label>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      max="10"
                      value={formData.accessFee}
                      onChange={(e) =>
                        setFormData({ ...formData, accessFee: parseFloat(e.target.value) })
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-electric-green"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-heading font-semibold mb-4 text-gray-100">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 p-3 glass-card rounded-lg cursor-pointer hover:border-electric-green/50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 text-electric-green bg-gray-800 border-gray-600 rounded focus:ring-electric-green"
                      />
                      <span className="text-gray-300 text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div>
                <h2 className="text-xl font-heading font-semibold mb-4 text-gray-100">
                  Photos
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Add photos of your charger and parking area. More photos = more bookings!
                </p>
                <ImageUpload
                  images={formData.photos}
                  onImagesChange={(photos) => setFormData({ ...formData, photos })}
                  maxImages={5}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-electric-green min-h-[120px]"
                  placeholder="Tell drivers about your charger location, access instructions, or special features..."
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-6 py-3 glass-card text-gray-300 rounded-lg font-medium hover:border-electric-green/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all disabled:opacity-50"
                >
                  {loading ? 'Listing...' : 'List Charger'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ListChargerPage;
