import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <Navbar />
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <h1 className="text-4xl font-heading font-bold mb-4 text-gray-100">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">1. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>Account information (name, email, password)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Booking history and preferences</li>
                <li>Charger listing information (for hosts)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>With hosts when you make a booking (name and contact info)</li>
                <li>With guests when they book your charger (for hosts)</li>
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">5. Payment Information</h2>
              <p>
                All payment information is processed securely through Stripe. We do not store your full credit card details on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account</li>
                <li>Opt-out of certain communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-semibold text-gray-100 mb-3">8. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@plugspot.com" className="text-electric-green hover:underline">
                  privacy@plugspot.com
                </a>
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

export default PrivacyPage;
