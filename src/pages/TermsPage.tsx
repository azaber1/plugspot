import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <Navbar />
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <h1 className="text-4xl font-heading font-bold mb-4 text-gray-100">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using PlugSpot, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">2. Use License</h2>
              <p>
                Permission is granted to temporarily use PlugSpot for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software contained on PlugSpot</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">4. Bookings and Payments</h2>
              <p>
                All bookings are subject to availability. Payments are processed securely through Stripe. Cancellations must be made before the booking start time to receive a refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">5. Host Responsibilities</h2>
              <p>
                Hosts are responsible for maintaining their chargers in working condition and ensuring accurate availability information. Hosts must comply with all local regulations and safety standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">6. Platform Commission</h2>
              <p>
                PlugSpot charges a 12% commission on all bookings. This fee is automatically deducted from payments before funds are transferred to hosts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">7. Limitation of Liability</h2>
              <p>
                PlugSpot shall not be liable for any damages arising from the use or inability to use the platform, including but not limited to direct, indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">8. Changes to Terms</h2>
              <p>
                PlugSpot reserves the right to revise these terms at any time. By continuing to use the platform, you agree to be bound by the revised terms.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
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

export default TermsPage;
