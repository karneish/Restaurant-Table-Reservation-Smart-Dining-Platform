import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed, CalendarDays, Shield, Menu, X, User, LogOut, ChevronDown,
  Sprout, Bell, CheckCheck, UserRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { notificationAPI } from '../services/api';
import type { AppNotification } from '../types';
import { cn } from '../utils/cn';
import { formatDateTime } from '../utils/format';

export default function Navbar() {
  const { userName, userRole, isAuthenticated, isAdmin, userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const userRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = () => {
      notificationAPI.get().then((res) => {
        setNotifications(res.data.data);
        setUnread(res.data.data.filter((n) => !n.read).length);
      }).catch(() => undefined);
      notificationAPI.unreadCount().then((res) => setUnread(res.data.data)).catch(() => undefined);
    };
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, [isAuthenticated, userEmail]);

  const openBell = () => {
    setBellOpen((o) => !o);
    if (!bellOpen) {
      notificationAPI.markAllRead().catch(() => undefined);
      setUnread(0);
    }
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      'nav-link text-sm font-semibold transition-colors flex items-center gap-1.5',
      isActive ? 'text-primary-700' : 'text-forest-700 hover:text-primary-700',
    );

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    setBellOpen(false);
    navigate('/');
  };

  const initials = (userName || 'G').trim().charAt(0).toUpperCase();

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-primary-100/70">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-[4.25rem] items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-950 text-white shadow-glow transition-transform duration-500 group-hover:rotate-[360deg]">
              <UtensilsCrossed className="w-5 h-5" />
              <Sprout className="absolute -top-1 -right-1 w-3.5 h-3.5 text-gold-300 anim-float" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold text-forest-900 group-hover:text-primary-700 transition-colors">
                TableHub
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                Reserve &middot; Dine
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            <NavLink to="/restaurants" className={linkCls}>Restaurants</NavLink>
            <NavLink to="/my-reservations" className={linkCls}>
              <CalendarDays className="w-4 h-4" /> My Reservations
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={linkCls}>
                <Shield className="w-4 h-4" /> Admin
              </NavLink>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && (
              <div className="relative" ref={bellRef}>
                <button
                  onClick={openBell}
                  className="relative w-10 h-10 rounded-full border border-primary-200 bg-white/70 hover:bg-white hover:shadow-soft text-forest-700 flex items-center justify-center transition-all"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-h-[26rem] overflow-y-auto rounded-2xl bg-white shadow-card-lg border border-primary-100 p-2 animate-zoom-in origin-top-right z-50">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-forest-50 mb-1">
                      <p className="text-sm font-bold text-forest-900">Notifications</p>
                      <button onClick={() => { notificationAPI.markAllRead().catch(() => undefined); setUnread(0); }} className="flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800">
                        <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-center text-sm text-forest-400 py-8">No notifications yet.</p>
                    ) : (
                      <div className="space-y-1">
                        {notifications.map((n) => (
                          <div key={n.id} className={cn('rounded-xl px-3 py-2.5', n.read ? 'opacity-60' : 'bg-primary-50')}>
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-forest-900 truncate">{n.title}</p>
                              <span className="text-[10px] text-forest-400 shrink-0">{formatDateTime(n.createdAt)}</span>
                            </div>
                            <p className="text-xs text-forest-500 leading-snug mt-0.5">{n.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {isAuthenticated ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen((o) => !o)}
                  className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 rounded-full border border-primary-200 bg-white/70 hover:bg-white hover:shadow-soft transition-all"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-800 text-white flex items-center justify-center text-sm font-bold shadow">
                    {initials}
                  </span>
                  <span className="text-sm font-semibold text-forest-800 max-w-[9rem] truncate">{userName}</span>
                  <ChevronDown className={cn('w-4 h-4 text-forest-400 transition-transform', userOpen && 'rotate-180')} />
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-card-lg border border-primary-100 p-1.5 animate-zoom-in origin-top-right">
                    <div className="px-3 py-2 border-b border-forest-50 mb-1">
                      <p className="text-sm font-semibold text-forest-900 truncate">{userName}</p>
                      <p className="text-xs text-forest-400">{userRole.toLowerCase()}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-forest-700 hover:bg-primary-50"
                    >
                      <UserRound className="w-4 h-4" /> My Profile
                    </Link>
                    <Link
                      to="/my-reservations"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-forest-700 hover:bg-primary-50"
                    >
                      <CalendarDays className="w-4 h-4" /> My Reservations
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-forest-700 hover:bg-primary-50"
                      >
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthOpen(true)} className="btn-secondary btn-sm flex items-center gap-1.5">
                <User className="w-4 h-4" /> Sign in
              </button>
            )}
            <Link to="/restaurants" className="btn-primary btn-sm">
              Book a Table
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button onClick={openBell} className="relative w-10 h-10 flex items-center justify-center rounded-xl text-forest-800 hover:bg-primary-50" aria-label="Notifications">
                  <Bell className="w-5 h-5" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-0.5 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-800 text-white flex items-center justify-center text-sm font-bold">
                  {initials}
                </span>
              </>
            )}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl text-forest-800 hover:bg-primary-50 transition-colors"
              onClick={() => setMenuOpen((m) => !m)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden pb-5 pt-1 space-y-1 animate-fade-in">
            <Link to="/restaurants" className="block px-3 py-2.5 rounded-xl text-forest-800 font-medium hover:bg-primary-50" onClick={() => setMenuOpen(false)}>Restaurants</Link>
            <Link to="/my-reservations" className="block px-3 py-2.5 rounded-xl text-forest-800 font-medium hover:bg-primary-50" onClick={() => setMenuOpen(false)}>My Reservations</Link>
            {isAuthenticated && (
              <Link to="/profile" className="block px-3 py-2.5 rounded-xl text-forest-800 font-medium hover:bg-primary-50" onClick={() => setMenuOpen(false)}>My Profile</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="block px-3 py-2.5 rounded-xl text-forest-800 font-medium hover:bg-primary-50" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
            )}
            <div className="flex items-center gap-2 pt-2">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn-secondary btn-sm flex-1 text-red-600">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              ) : (
                <button onClick={() => { setAuthOpen(true); setMenuOpen(false); }} className="btn-secondary btn-sm flex-1">
                  <User className="w-4 h-4" /> Sign in
                </button>
              )}
              <Link to="/restaurants" className="btn-primary btn-sm flex-1" onClick={() => setMenuOpen(false)}>Book a Table</Link>
            </div>
          </div>
        )}
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
