import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CalendarDays, Users, CreditCard, UtensilsCrossed, CheckCircle2,
  XCircle, ArrowLeft, Table2, Sprout, MapPin, Download, Ticket, Timer, PartyPopper,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { reservationAPI, errorMessage } from '../services/api';
import type { Reservation } from '../types';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { formatDateTime, formatINR } from '../utils/format';

export default function ReservationDetailPage() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!reservationId) return;
    reservationAPI.getByReservationId(reservationId)
      .then((res) => setReservation(res.data.data))
      .catch(() => toast.error('Reservation not found'))
      .finally(() => setLoading(false));
  }, [reservationId]);

  const handlePay = async () => {
    if (!reservation) return;
    setPaying(true);
    try {
      const res = await reservationAPI.confirm(reservation.reservationId);
      setReservation(res.data.data);
      toast.success('Deposit paid. Reservation confirmed!');
    } catch (err) {
      toast.error(errorMessage(err, 'Payment failed'));
    } finally {
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    if (!reservation || !window.confirm('Cancel this reservation? Your tables will be released.')) return;
    setCancelling(true);
    try {
      const res = await reservationAPI.cancel(reservation.reservationId);
      setReservation(res.data.data);
      toast.success('Reservation cancelled');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not cancel'));
    } finally {
      setCancelling(false);
    }
  };

  const handleDownload = () => {
    if (!reservation) return;
    const text = [
      'TABLEHUB RESERVATION',
      '====================',
      `Restaurant: ${reservation.restaurantName} (${reservation.restaurantCity})`,
      `Date/Time: ${formatDateTime(reservation.reservationDateTime)}`,
      `Party: ${reservation.partySize} guests`,
      `Area: ${reservation.areaName}`,
      `Tables: ${reservation.tables.map((t) => t.tableNumber).join(', ')}`,
      `Deposit: ${formatINR(reservation.depositAmount)}`,
      `Code: ${reservation.confirmationCode}`,
      `Status: ${reservation.status}`,
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tablehub-${reservation.confirmationCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="card h-64 shimmer" />
        <div className="card h-40 shimmer" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card text-center py-16">
          <Ticket className="w-12 h-12 mx-auto mb-3 text-primary-400 anim-float" />
          <p className="text-forest-600 font-medium mb-4">Reservation not found.</p>
          <Link to="/my-reservations" className="btn-primary btn-sm">My Reservations</Link>
        </div>
      </div>
    );
  }

  const isPending = reservation.status === 'HOLD';
  const isCancellable = reservation.status === 'HOLD' || reservation.status === 'CONFIRMED';
  const showPay = isPending && !reservation.payment;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/my-reservations" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline">
        <ArrowLeft className="w-4 h-4" /> My Reservations
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center shadow-glow">
            <Sprout className="w-6 h-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-forest-900">{reservation.restaurantName}</h1>
            <p className="text-sm text-forest-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {reservation.restaurantCity}
            </p>
          </div>
        </div>
        <StatusBadge status={reservation.status} />
      </div>

      {/* ================= TICKET ================= */}
      <div className="card relative overflow-hidden p-0 shadow-card-lg">
        <div className="bg-gradient-to-br from-primary-800 to-primary-600 text-white px-7 py-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-gold-300" />
            <span className="font-semibold uppercase tracking-wider text-sm">Reservation ticket</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-primary-100/80">Confirmation code</p>
            <p className="font-mono text-lg font-bold tracking-widest text-gold-300">{reservation.confirmationCode}</p>
          </div>
        </div>

        {/* perforated edge */}
        <div className="relative h-4 bg-primary-600">
          <div className="absolute inset-0 flex justify-between px-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full bg-cream -translate-y-1" />
            ))}
          </div>
        </div>

        <div className="px-7 py-6 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { icon: CalendarDays, label: 'When', value: formatDateTime(reservation.reservationDateTime) },
            { icon: Users, label: 'Party', value: `${reservation.partySize} guests` },
            { icon: Table2, label: 'Area', value: reservation.areaName },
            { icon: CreditCard, label: 'Deposit', value: formatINR(reservation.depositAmount) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-forest-400 mb-1">
                <Icon className="w-3.5 h-3.5 text-primary-600" /> {label}
              </p>
              <p className="text-sm font-semibold text-forest-900 leading-snug">{value}</p>
            </div>
          ))}
        </div>

        <div className="px-7 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400 mb-2">Your tables</p>
          <div className="flex flex-wrap gap-2">
            {reservation.tables.map((t) => (
              <span key={t.id} className="forest-chip !px-3 !py-1.5">
                Table {t.tableNumber} · {t.capacity} seats · {t.zone}
              </span>
            ))}
          </div>
        </div>

        {reservation.occasion && (
          <div className="px-7 pb-6">
            <div className="rounded-xl bg-gold-50 border border-gold-200 p-4">
              <p className="text-sm font-semibold text-gold-800 flex items-center gap-1.5">
                <PartyPopper className="w-4 h-4" /> {reservation.occasion.charAt(0) + reservation.occasion.slice(1).toLowerCase()} celebration
              </p>
              {reservation.celebrationNotes && <p className="text-xs text-gold-700 mt-1">“{reservation.celebrationNotes}”</p>}
              {reservation.addOns && reservation.addOns.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {reservation.addOns.map((a) => (
                    <span key={a.id} className="text-xs bg-white/70 border border-gold-200 rounded-full px-2.5 py-1 text-gold-800 font-medium">
                      {a.emoji} {a.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-7 pb-6 flex flex-col sm:flex-row items-center gap-5 border-t border-primary-100 pt-6">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400 mb-1.5 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-primary-600" /> Table Companion QR
            </p>
            <p className="text-sm text-forest-500 mb-3">
              Scan this at your table to call a waiter, request the bill and track your celebration.
            </p>
            <div className="bg-white rounded-xl p-3 inline-block border border-primary-200 shadow-soft">
              <QRCodeSVG
                value={`${window.location.origin}/table/${reservation.reservationId}`}
                size={132}
                bgColor="#ffffff"
                fgColor="#1a3a2b"
                level="M"
              />
            </div>
            <p className="mt-2 text-[11px] text-forest-400 font-mono">
              {window.location.origin}/table/{reservation.reservationId}
            </p>
          </div>
        </div>

        <div className="border-t border-dashed border-primary-200 px-7 py-3 flex items-center justify-between text-xs text-forest-400">
          <span className="flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" /> Booked {formatDateTime(reservation.createdAt)}</span>
          <button onClick={handleDownload} className="inline-flex items-center gap-1 font-semibold text-primary-700 hover:text-primary-800">
            <Download className="w-3.5 h-3.5" /> Save ticket
          </button>
        </div>
      </div>

      {/* ================= PRE-ORDER ================= */}
      {reservation.preOrder && reservation.preOrder.items.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-forest-900 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary-600" /> Pre-order
            </h2>
            <StatusBadge status={reservation.preOrder.status} />
          </div>
          <div className="divide-y divide-primary-100">
            {reservation.preOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2.5 text-sm">
                <span className="text-forest-700">
                  {item.name} <span className="text-forest-400">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-forest-800">{formatINR(Number(item.unitPrice) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <p className="text-right mt-3 font-display font-semibold text-primary-700 text-lg">
            Total: {formatINR(reservation.preOrder.totalAmount)}
          </p>
        </div>
      )}

      {/* ================= PAYMENT ================= */}
      {reservation.payment && (
        <div className="card !p-5 flex items-center gap-4 animate-fade-up">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center shadow-glow shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </span>
          <div>
            <p className="font-semibold text-forest-900">Deposit paid</p>
            <p className="text-sm text-forest-500">
              {formatINR(reservation.payment.amount)} via {reservation.payment.paymentMethod} · {reservation.payment.transactionId}
            </p>
          </div>
        </div>
      )}

      {/* ================= ACTIONS ================= */}
      <div className="space-y-3">
        {showPay && (
          <Button onClick={handlePay} disabled={paying} className="w-full !py-4" size="lg">
            <CreditCard className="w-5 h-5" />
            {paying ? 'Processing…' : `Pay Deposit & Confirm (${formatINR(reservation.depositAmount)})`}
          </Button>
        )}
        {isCancellable && (
          <Button variant="danger" onClick={handleCancel} disabled={cancelling} className="w-full !py-3.5">
            <XCircle className="w-5 h-5" />
            {cancelling ? 'Cancelling…' : 'Cancel Reservation'}
          </Button>
        )}
      </div>
    </div>
  );
}
