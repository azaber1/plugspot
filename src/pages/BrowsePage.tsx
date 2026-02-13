import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { ConnectorType } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { useAvailability } from '../hooks/useAvailability';
import { formatNextAvailableTime, formatDateTime, calculateDistance } from '../utils/scheduling';

// User's location (in real app, get from geolocation or user profile)
const USER_LOCATION = { lat: 37.8044, lng: -122.2712 };

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

const connectorTypes: (ConnectorType | 'All')[] = ['All', 'J1772', 'Tesla NACS', 'CCS'];

type SortOption = 'distance' | 'price-low' | 'price-high' | 'rating' | 'power';

const BrowsePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState<ConnectorType | 'All'>('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const { toggleFavorite, isFavorite } = useFavorites();
  const { chargers } = useAvailability();

  const filteredChargers = useMemo(() => {
    return chargers
      .map((charger) => {
        // Calculate real distance
        const distance = calculateDistance(
          USER_LOCATION.lat,
          USER_LOCATION.lng,
          charger.latitude,
          charger.longitude
        );
        return { ...charger, distance };
      })
      .filter((charger) => {
        const matchesSearch =
          charger.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          charger.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          charger.host.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesConnector = selectedConnector === 'All' || charger.connector === selectedConnector;
        const matchesAvailability = !showAvailableOnly || charger.available;
        const matchesFavorites = !showFavoritesOnly || isFavorite(charger.id);

        return matchesSearch && matchesConnector && matchesAvailability && matchesFavorites;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'distance':
            return a.distance - b.distance;
          case 'price-low':
            return a.pricePerKwh - b.pricePerKwh;
          case 'price-high':
            return b.pricePerKwh - a.pricePerKwh;
          case 'rating':
            return b.host.rating - a.host.rating;
          case 'power':
            return b.powerKW - a.powerKW;
          default:
            return a.distance - b.distance;
        }
      });
  }, [searchQuery, selectedConnector, showAvailableOnly, showFavoritesOnly, sortBy, isFavorite, chargers]);

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <Navbar />
      
      <div className="container mx-auto px-4 pb-20">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="glass-card p-4">
            <input
              type="text"
              placeholder="Search by address, city, or host name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none text-lg"
            />
          </div>
        </motion.div>

        {/* Filters & Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex flex-wrap gap-2">
              {connectorTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedConnector(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedConnector === type
                      ? 'bg-electric-green text-gray-900 shadow-glow-green-sm'
                      : 'glass-card text-gray-300 hover:border-electric-green/50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="w-4 h-4 text-electric-green bg-gray-800 border-gray-600 rounded focus:ring-electric-green"
              />
              <span className="text-gray-300 font-medium">Available Only</span>
            </label>
            <label className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                className="w-4 h-4 text-electric-green bg-gray-800 border-gray-600 rounded focus:ring-electric-green"
              />
              <span className="text-gray-300 font-medium">Favorites Only</span>
            </label>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="glass-card px-4 py-2 rounded-lg text-gray-300 font-medium focus:outline-none focus:border-electric-green border border-gray-700 bg-gray-800/50"
            >
              <option value="distance">Distance (Nearest)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="rating">Rating (Highest)</option>
              <option value="power">Power (Highest)</option>
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-gray-400"
        >
          {filteredChargers.length} charger{filteredChargers.length !== 1 ? 's' : ''} found
        </motion.div>

        {/* Charger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChargers.map((charger, idx) => (
            <motion.div
              key={charger.id}
              {...fadeUp}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(charger.id);
                  }}
                  className="absolute top-4 right-4 z-10 p-2 glass-card rounded-lg hover:border-electric-green/60 transition-all"
                  aria-label={isFavorite(charger.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <span className={`text-xl ${isFavorite(charger.id) ? 'text-electric-green' : 'text-gray-400'}`}>
                    {isFavorite(charger.id) ? '❤️' : '🤍'}
                  </span>
                </button>
                <Link to={`/charger/${charger.id}`}>
                  <div className="glass-card p-6 hover:border-electric-green/60 transition-all cursor-pointer h-full flex flex-col">
                    {/* Host Info */}
                    <div className="flex items-center gap-3 mb-4">
                    <img
                      src={charger.host.avatar}
                      alt={charger.host.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-100">{charger.host.name}</span>
                        {charger.host.verified && (
                          <span className="text-electric-green text-sm">✓</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <span>★</span>
                        <span>{charger.host.rating}</span>
                        <span>({charger.host.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-4">
                    <p className="text-gray-300 font-medium">{charger.address}</p>
                    <p className="text-gray-500 text-sm">{charger.city} • {charger.distance} mi</p>
                  </div>

                  {/* Connector Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-electric-green/20 text-electric-green rounded-full text-sm font-medium">
                      {charger.connector}
                    </span>
                  </div>

                  {/* Specs */}
                  <div className="mb-4 text-sm text-gray-400 space-y-1">
                    <p>⚡ {charger.powerKW} kW</p>
                    <p>💰 ${charger.pricePerKwh.toFixed(2)}/kWh</p>
                  </div>

                  {/* Availability */}
                  <div className="mt-auto">
                    {charger.available ? (
                      charger.nextSlot ? (
                        <div className="space-y-1">
                          <span className="inline-block px-3 py-1 bg-electric-green/20 text-electric-green rounded-full text-sm font-medium">
                            Available Now
                          </span>
                          <p className="text-xs text-gray-500">
                            Next booking: {formatDateTime(new Date(charger.nextSlot))}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-electric-green/20 text-electric-green rounded-full text-sm font-medium">
                          Available
                        </span>
                      )
                    ) : (
                      <div className="space-y-1">
                        <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                          In Use
                        </span>
                        {charger.nextSlot && (
                          <p className="text-xs text-gray-500">
                            {formatNextAvailableTime(new Date(charger.nextSlot))}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {charger.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredChargers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-400"
          >
            <p className="text-xl">No chargers found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
