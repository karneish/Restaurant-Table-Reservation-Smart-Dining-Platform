import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ForestBackground from './components/ForestBackground';
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import ReservationPage from './pages/ReservationPage';
import MyReservationsPage from './pages/MyReservationsPage';
import ReservationDetailPage from './pages/ReservationDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import TableCompanionPage from './pages/TableCompanionPage';

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col">
      <ForestBackground />
      <Navbar />
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-10 relative z-10 flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="/reserve" element={<ReservationPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
          <Route path="/reservations/:reservationId" element={<ReservationDetailPage />} />
          <Route path="/table/:reservationId" element={<TableCompanionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '14px',
            border: '1px solid rgba(44,111,82,0.2)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            color: '#1a3a2b',
            fontWeight: 500,
            boxShadow: '0 12px 40px rgba(16,29,21,0.18)',
          },
          success: { iconTheme: { primary: '#2c6f52', secondary: '#ffffff' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#ffffff' } },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
