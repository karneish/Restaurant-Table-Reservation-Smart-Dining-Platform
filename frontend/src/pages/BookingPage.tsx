import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAPI, theatreAPI, bookingAPI } from '../services/api';
import type { Show, Seat } from '../types';
import SeatGrid from '../components/SeatGrid';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  useEffect(() => {
    if (!showId) return;
    Promise.all([
      showAPI.search({ date: new Date().toISOString().split('T')[0] }),
      theatreAPI.getSeats(1),
    ]).then(([showsRes]) => {
      const found = showsRes.data.data.find((s: Show) => s.id === Number(showId));
      setShow(found || null);
      if (found) {
        theatreAPI.getSeats(found.screenId || 1).then(res => setSeats(res.data.data));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [showId]);

  useEffect(() => {
    if (show?.screenId) {
      theatreAPI.getSeats(show.screenId).then(res => setSeats(res.data.data)).catch(() => {});
    }
  }, [show?.screenId]);

  const toggleSeat = (seatId: number) => {
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (!showId || selectedSeats.length === 0) return;
    setBooking(true);
    try {
      const res = await bookingAPI.create(Number(showId), selectedSeats);
      const booking = res.data.data;
      const payRes = await bookingAPI.confirm(booking.bookingId, paymentMethod);
      toast.success('Booking confirmed! 🎉');
      navigate(`/bookings/${payRes.data.data.bookingId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded-xl" /></div>;
  }

  if (!show) return <div className="text-center py-12 text-gray-500">Show not found</div>;

  const totalAmount = show.ticketPrice * selectedSeats.length;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-primary-600">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="card">
        <h1 className="text-xl font-bold mb-2">Select Your Seats</h1>
        <div className="text-sm text-gray-500 space-y-1">
          <p>Show: {show.movieTitle || 'Movie'} | {show.theatreName || 'Theatre'} | {show.showDate} {show.showTime}</p>
          <p>Price: ₹{show.ticketPrice} per seat</p>
        </div>
      </div>

      <div className="card">
        <SeatGrid seats={seats} selectedSeats={selectedSeats} onToggle={toggleSeat} />
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">
              Selected: <span className="font-semibold text-gray-800">{selectedSeats.length} seats</span>
            </p>
            <p className="text-lg font-bold text-primary-700">Total: ₹{totalAmount}</p>
          </div>
          <div className="flex items-center gap-4">
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
              className="input-field w-40">
              <option value="CARD">Credit Card</option>
              <option value="UPI">UPI</option>
              <option value="NET_BANKING">Net Banking</option>
            </select>
            <button onClick={handleBooking} disabled={selectedSeats.length === 0 || booking}
              className="btn-primary flex items-center gap-2">
              {booking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {booking ? 'Processing...' : `Pay ₹${totalAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
