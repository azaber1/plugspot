import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

const features = [
  { icon: '⚡', title: 'Fast Listing', desc: 'List your charger in minutes' },
  { icon: '📍', title: 'Nearby Search', desc: 'Find chargers close to you' },
  { icon: '📅', title: 'Smart Scheduling', desc: 'Book ahead or on-demand' },
  { icon: '💳', title: 'Auto Payments', desc: 'Seamless transactions' },
  { icon: '🛡️', title: 'Built-in Trust', desc: 'Verified hosts & reviews' },
  { icon: '🌐', title: 'Neighborhood Networks', desc: 'Connect with your community' },
];

const steps = [
  {
    number: '1',
    title: 'Find a Charger',
    desc: 'Search for available chargers near you or your destination',
  },
  {
    number: '2',
    title: 'Book & Charge',
    desc: 'Reserve your slot and plug in when you arrive',
  },
  {
    number: '3',
    title: 'Pay Automatically',
    desc: 'Your payment is processed securely after charging',
  },
];

const LandingPage = () => {

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-bg dot-pattern opacity-50"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1593941707882-a5bac6861d0d?w=1920&q=80)',
          }}
        ></div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-gray-100 leading-tight">
              Your driveway is the next{' '}
              <span className="text-electric-green">charging station</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Rent out your home EV charger or find one nearby. Join the peer-to-peer charging revolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="px-8 py-4 bg-electric-green text-gray-900 rounded-lg font-semibold text-lg hover:shadow-glow-green transition-all"
              >
                Find a Charger
              </Link>
              <Link
                to="/list-charger"
                className="px-8 py-4 glass-card text-gray-100 rounded-lg font-semibold text-lg border-electric-green/30 hover:border-electric-green/60 transition-all"
              >
                List Your Charger
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            {...fadeUp}
            className="text-4xl md:text-5xl font-heading font-bold text-center mb-16 text-gray-100"
          >
            Why Choose PlugSpot?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                {...fadeUp}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 hover:border-electric-green/60 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-heading font-semibold mb-2 text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            {...fadeUp}
            className="text-4xl md:text-5xl font-heading font-bold text-center mb-16 text-gray-100"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                {...fadeUp}
                transition={{ delay: idx * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-electric-green rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-heading font-bold text-gray-900">
                  {step.number}
                </div>
                <h3 className="text-2xl font-heading font-semibold mb-3 text-gray-100">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            {...fadeUp}
            className="glass-card p-12 text-center border-2 border-electric-green/50 shadow-glow-green"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gray-100">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of drivers and hosts powering the future of EV charging.
            </p>
            <Link
              to="/browse"
              className="inline-block px-8 py-4 bg-electric-green text-gray-900 rounded-lg font-semibold text-lg hover:shadow-glow-green transition-all"
            >
              Browse Chargers Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; 2024 PlugSpot. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/about" className="text-gray-400 hover:text-electric-green transition-colors">
                About
              </Link>
              <Link to="/help" className="text-gray-400 hover:text-electric-green transition-colors">
                Help
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-electric-green transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-electric-green transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
