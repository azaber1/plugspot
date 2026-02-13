import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I book a charger?',
        a: 'Browse available chargers, select one, choose your time slot, and complete payment. Your booking will be confirmed immediately.',
      },
      {
        q: 'Do I need an account to book?',
        a: 'Yes, you need to create a free account to book chargers. This helps us keep your bookings secure and allows you to manage your reservations.',
      },
      {
        q: 'How do I list my charger?',
        a: 'Sign up, go to your dashboard, and click "List Your Charger". Fill out the form with your charger details and you\'re ready to start earning!',
      },
    ],
  },
  {
    category: 'Booking & Payments',
    questions: [
      {
        q: 'When do I pay?',
        a: 'Payment is processed when you complete your booking. We use Stripe for secure payments.',
      },
      {
        q: 'Can I cancel a booking?',
        a: 'Yes, you can cancel upcoming bookings from your bookings page. Cancellations are free if done before the booking starts.',
      },
      {
        q: 'How are prices calculated?',
        a: 'Prices are based on energy cost (power × hours × price per kWh) plus an access fee. The platform takes a 12% commission.',
      },
    ],
  },
  {
    category: 'For Hosts',
    questions: [
      {
        q: 'How do I get paid?',
        a: 'Connect your Stripe account in Payment Settings. When guests book, 88% of the payment goes directly to your Stripe account automatically.',
      },
      {
        q: 'What commission does the platform take?',
        a: 'The platform takes a 12% commission on each booking. This covers payment processing, platform maintenance, and customer support.',
      },
      {
        q: 'How do I manage my charger availability?',
        a: 'Go to your Host Dashboard and toggle availability for each charger. You can also see all upcoming bookings there.',
      },
    ],
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'What connector types are supported?',
        a: 'We support J1772, CCS, Tesla NACS, and CHAdeMO connectors. Filter by connector type when browsing.',
      },
      {
        q: 'How do I know if a charger is available?',
        a: 'The platform shows real-time availability. If a charger is in use, you\'ll see the next available time slot.',
      },
      {
        q: 'What if I have issues during charging?',
        a: 'Contact the host through the platform or reach out to our support team. We\'re here to help!',
      },
    ],
  },
];

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <Navbar />
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-heading font-bold mb-4 text-gray-100">Help & Support</h1>
          <p className="text-gray-400 mb-12">
            Find answers to common questions or contact our support team.
          </p>

          {/* FAQ Sections */}
          <div className="space-y-8 mb-12">
            {faqs.map((section, sectionIdx) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIdx * 0.1 }}
                className="glass-card p-6"
              >
                <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">
                  {section.category}
                </h2>
                <div className="space-y-4">
                  {section.questions.map((faq, idx) => (
                    <div key={idx} className="border-b border-gray-700 last:border-0 pb-4 last:pb-0">
                      <h3 className="font-semibold text-gray-100 mb-2">{faq.q}</h3>
                      <p className="text-gray-400 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 text-center"
          >
            <h2 className="text-2xl font-heading font-semibold mb-4 text-gray-100">
              Still Need Help?
            </h2>
            <p className="text-gray-400 mb-6">
              Can't find what you're looking for? Contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@plugspot.com"
                className="px-6 py-3 bg-electric-green text-gray-900 rounded-lg font-semibold hover:shadow-glow-green transition-all"
              >
                Email Support
              </a>
              <Link
                to="/"
                className="px-6 py-3 glass-card text-gray-300 rounded-lg font-medium hover:border-electric-green/50 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;
