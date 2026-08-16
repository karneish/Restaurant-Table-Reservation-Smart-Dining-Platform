import { Link } from 'react-router-dom';
import { UtensilsCrossed, Sprout, Instagram, Facebook, Twitter, MapPin, Mail, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAdmin } = useAuth();
  return (
    <footer className="relative z-10 mt-auto">
      <div className="bg-primary-950 text-primary-100/80">
        <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <UtensilsCrossed className="w-4 h-4" />
                <Sprout className="absolute -top-1 -right-1 w-3 h-3 text-gold-300" />
              </span>
              <span className="font-display text-xl font-bold text-white">TableHub</span>
            </Link>
            <p className="text-sm mt-4 text-primary-200/70 leading-relaxed">
              India&apos;s smartest dining reservation platform. Reserve a table, pre-order your favourites and never wait again.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/restaurants" className="hover:text-gold-300 transition-colors">Restaurants</Link></li>
              <li><Link to="/my-reservations" className="hover:text-gold-300 transition-colors">My Reservations</Link></li>
              {isAdmin && <li><Link to="/admin" className="hover:text-gold-300 transition-colors">Admin Dashboard</Link></li>}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold-400" /> Bengaluru, India</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold-400" /> hello@tablehub.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold-400" /> +91 98765 43210</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Follow us</h4>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-100 hover:bg-gold-500 hover:text-primary-950 hover:border-gold-500 transition-all"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-primary-200/60 mt-4">Follow us for dining inspiration &amp; exclusive offers.</p>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-primary-200/60">
            <p>&copy; {new Date().getFullYear()} TableHub. All rights reserved.</p>
            <p>Reserve a table in the heart of the forest 🌿</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
