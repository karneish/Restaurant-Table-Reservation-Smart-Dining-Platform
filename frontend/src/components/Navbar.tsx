import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, User, LogOut, Ticket, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, isAdmin, userName, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
            <Film className="w-7 h-7" />
            TicketHub
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/movies" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Movies
            </Link>
            {isAuthenticated && (
              <Link to="/my-bookings" className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                <Ticket className="w-4 h-4" /> My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                <Shield className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <User className="w-4 h-4" /> {userName}
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/movies" className="block py-2 text-gray-600" onClick={() => setMenuOpen(false)}>Movies</Link>
            {isAuthenticated && (
              <Link to="/my-bookings" className="block py-2 text-gray-600" onClick={() => setMenuOpen(false)}>My Bookings</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="block py-2 text-gray-600" onClick={() => setMenuOpen(false)}>Admin</Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="block py-2 text-red-500">Logout</button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="btn-secondary text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary text-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
