import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import ChargerDetailPage from './pages/ChargerDetailPage';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import HostDashboardPage from './pages/HostDashboardPage';
import PlatformDashboardPage from './pages/PlatformDashboardPage';
import StripeConnectPage from './pages/StripeConnectPage';
import StripeConnectCallbackPage from './pages/StripeConnectCallbackPage';
import ReviewPage from './pages/ReviewPage';
import ListChargerPage from './pages/ListChargerPage';
import HelpPage from './pages/HelpPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import AboutPage from './pages/AboutPage';
import { ToastProvider } from './components/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/charger/:id" element={<ChargerDetailPage />} />
              <Route path="/charger/:id/review" element={<ReviewPage />} />
              <Route path="/bookings" element={<BookingHistoryPage />} />
              <Route path="/booking/:id/confirm" element={<BookingConfirmationPage />} />
              <Route path="/dashboard" element={<HostDashboardPage />} />
              <Route path="/stripe-connect" element={<StripeConnectPage />} />
              <Route path="/stripe-connect/callback" element={<StripeConnectCallbackPage />} />
              <Route path="/platform" element={<PlatformDashboardPage />} />
              <Route path="/list-charger" element={<ListChargerPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
