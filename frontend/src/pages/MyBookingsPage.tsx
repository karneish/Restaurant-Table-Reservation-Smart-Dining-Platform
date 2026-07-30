import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import type { Booking } from '../types';
import { Ticket, Clock, CheckCircle, XCircle, Search } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      let res;
      if (searchTerm.startsWith('BOK')) {
        res = await bookingAPI.getByBookingId(searchTerm);
        setBookings([res.data.data]);
      } else {
        res = await bookingAPI.getByTicket(searchTerm);
        setBookings([res.data.data]);
      }
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search by Booking ID or Ticket Number..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="input-field pl-10" />
        </div>
        <button onClick={handleSearch} className="btn-primary">Search</button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="card animate-pulse h-24" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Ticket className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No bookings found</p>
          <Link to="/movies" className="text-primary-600 hover:underline mt-2 inline-block">Browse Movies</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <Link key={booking.id} to={`/bookings/${booking.bookingId}`} className="card block hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{booking.movieTitle || 'Movie'}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(booking.status)}`}>
                      {getStatusIcon(booking.status)} {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{booking.theatreName} | {booking.showDate} {booking.showTime}</p>
                  <p className="text-sm text-gray-500">Booking: {booking.bookingId} | Ticket: {booking.ticketNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary-700">₹{booking.totalAmount}</p>
                  <p className="text-xs text-gray-400">{booking.seats?.length || 0} seat(s)</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
