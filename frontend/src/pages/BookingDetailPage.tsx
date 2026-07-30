import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import type { Booking } from '../types';
import { CheckCircle, XCircle, Clock, Download, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingDetailPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    bookingAPI.getByBookingId(bookingId).then(res => {
      setBooking(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [bookingId]);

  const handleCancel = async () => {
    if (!booking || !window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      const res = await bookingAPI.cancel(booking.bookingId);
      setBooking(res.data.data);
      toast.success('Booking cancelled');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded-xl" /></div>;
  if (!booking) return <div className="text-center py-12 text-gray-500">Booking not found</div>;

  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-800 border-green-300',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-300',
    CANCELLED: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/my-bookings" className="flex items-center gap-1 text-gray-500 hover:text-primary-600">
        <ArrowLeft className="w-4 h-4" /> Back to Bookings
      </Link>

      <div className={`card border-2 ${booking.status === 'CONFIRMED' ? 'border-green-400' : booking.status === 'CANCELLED' ? 'border-red-400' : 'border-amber-400'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-sm text-gray-500">{booking.bookingId}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${statusColors[booking.status]}`}>
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
          <div>
            <p className="text-xs text-gray-400">Ticket Number</p>
            <p className="font-mono font-semibold">{booking.ticketNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Amount</p>
            <p className="font-bold text-xl text-primary-700">₹{booking.totalAmount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Movie</p>
            <p className="font-medium">{booking.movieTitle || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Theatre</p>
            <p className="font-medium">{booking.theatreName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Date & Time</p>
            <p className="font-medium">{booking.showDate} {booking.showTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Seats</p>
            <p className="font-medium">{booking.seats?.length || 0} seat(s)</p>
          </div>
        </div>

        {booking.payment && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Payment Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Transaction ID</p>
                <p className="font-mono">{booking.payment.transactionId}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p>{booking.payment.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Status</p>
                <p className="font-medium text-green-600">{booking.payment.status}</p>
              </div>
            </div>
          </div>
        )}

        {booking.status === 'CONFIRMED' && (
          <button onClick={handleCancel} disabled={cancelling}
            className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 w-full">
            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        )}
      </div>
    </div>
  );
}
