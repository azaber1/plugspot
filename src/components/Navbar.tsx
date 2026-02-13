import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-card mx-4 mt-4 rounded-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-electric-green rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-lg">⚡</span>
            </div>
            <span className="text-xl font-heading font-bold text-gray-100">PlugSpot</span>
          </Link>
          <div className="flex items-center gap-3 md:gap-6">
            <Link
              to="/browse"
              className="hidden sm:block text-gray-300 hover:text-electric-green transition-colors font-medium"
            >
              Browse
            </Link>
            <Link
              to="/map"
              className="hidden md:block text-gray-300 hover:text-electric-green transition-colors font-medium"
            >
              Map
            </Link>
            {isAuthenticated ? (
              <Link
                to="/list-charger"
                className="hidden md:block px-3 md:px-4 py-2 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all text-sm md:text-base"
              >
                <span className="hidden sm:inline">List Charger</span>
                <span className="sm:hidden">List</span>
              </Link>
            ) : null}
            {isAuthenticated ? (
              <>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 glass-card rounded-lg hover:border-electric-green/50 transition-all"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden md:block text-gray-300 font-medium">{user?.name}</span>
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 glass-card p-2 rounded-lg z-50"
                      >
                        <Link
                          to="/bookings"
                          className="block px-4 py-2 text-gray-300 hover:text-electric-green transition-colors rounded"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Bookings
                        </Link>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-gray-300 hover:text-electric-green transition-colors rounded"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Host Dashboard
                        </Link>
                        <Link
                          to="/stripe-connect"
                          className="block px-4 py-2 text-gray-300 hover:text-electric-green transition-colors rounded"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Payment Settings
                        </Link>
                        {(user?.email === 'demo@plugspot.com' || user?.email === 'admin@plugspot.com') && (
                          <Link
                            to="/platform"
                            className="block px-4 py-2 text-gray-300 hover:text-electric-green transition-colors rounded"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Platform Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-300 hover:text-red-400 transition-colors rounded"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 md:px-4 py-2 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all text-sm md:text-base"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
