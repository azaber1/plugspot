import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <Navbar />
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="glass-card p-8 mb-8">
            <h1 className="text-4xl font-heading font-bold mb-4 text-gray-100">About PlugSpot</h1>
            <p className="text-xl text-gray-300 mb-6">
              Connecting EV drivers with charging stations in their community
            </p>
            <p className="text-gray-400 leading-relaxed">
              PlugSpot is a peer-to-peer EV charger rental marketplace that makes it easy for electric vehicle owners 
              to find and book charging stations, while enabling charger owners to monetize their equipment. 
              We're building a sustainable future by maximizing the use of existing charging infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-heading font-semibold mb-3 text-gray-100">Our Mission</h2>
              <p className="text-gray-400">
                To accelerate EV adoption by making charging accessible, affordable, and convenient for everyone. 
                We believe that by connecting communities, we can build a more sustainable transportation future.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-2xl font-heading font-semibold mb-3 text-gray-100">How It Works</h2>
              <p className="text-gray-400">
                EV drivers browse available chargers, book time slots, and charge their vehicles. 
                Charger owners earn money by sharing their equipment. It's that simple.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 mb-8"
          >
            <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">Why PlugSpot?</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-100 mb-2">Fast & Easy</h3>
                <p className="text-sm text-gray-400">Find and book chargers in minutes</p>
              </div>
              <div>
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-semibold text-gray-100 mb-2">Earn Money</h3>
                <p className="text-sm text-gray-400">Monetize your charging equipment</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🌱</div>
                <h3 className="font-semibold text-gray-100 mb-2">Sustainable</h3>
                <p className="text-sm text-gray-400">Maximize use of existing infrastructure</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 text-center"
          >
            <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">Get Started Today</h2>
            <p className="text-gray-400 mb-6">
              Join thousands of EV drivers and charger owners already using PlugSpot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="px-6 py-3 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all"
              >
                Browse Chargers
              </Link>
              <Link
                to="/list-charger"
                className="px-6 py-3 glass-card text-gray-300 rounded-lg font-medium hover:border-electric-green/50 transition-all"
              >
                List Your Charger
              </Link>
            </div>
          </motion.div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-electric-green hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
