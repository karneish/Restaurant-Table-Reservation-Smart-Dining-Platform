import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MapPin, Users, BellRing, Receipt, UtensilsCrossed, CheckCircle2,
  PartyPopper, Sparkles, Timer, BellRing as BellRingOn,
} from 'lucide-react';
import { reservationAPI, errorMessage } from '../services/api';
import type { CompanionSummary } from '../types';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { formatINR } from '../utils/format';

export default function TableCompanionPage() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const [summary, setSummary] = useState<CompanionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!reservationId) return;
    reservationAPI.companion.get(reservationId)
      .then((res) => setSummary(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [reservationId]);

  const callWaiter = async () => {
    if (!reservationId) return;
    setBusy(true);
    try {
      const res = await reservationAPI.companion.callWaiter(reservationId);
      setSummary(res.data.data);
      toast.success('Waiter notified — they are on the way!');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not call waiter'));
    } finally {
      setBusy(false);
    }
  };

  const requestBill = async () => {
    if (!reservationId) return;
    setBusy(true);
    try {
      const res = await reservationAPI.companion.requestBill(reservationId);
      setSummary(res.data.data);
      toast.success('Bill requested — check with your server shortly.');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not request bill'));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="max-w-lg mx-auto space-y-3"><div className="card h-64 shimmer" /><div className="card h-40 shimmer" /></div>;
  }

  if (notFound || !summary) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card text-center py-16">
          <Receipt className="w-12 h-12 mx-auto mb-3 text-primary-400 anim-float" />
          <p className="text-forest-600 font-medium mb-4">We couldn't find this table. Check your QR code and try again.</p>
          <Link to="/" className="btn-primary btn-sm">Back to TableHub</Link>
        </div>
      </div>
    );
  }

  const seated = summary.status === 'SEATED';

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="card overflow-hidden p-0 shadow-card-lg">
        <div className="bg-gradient-to-br from-primary-800 to-primary-600 text-white px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-primary-100/80">Dining companion</p>
              <h1 className="font-display text-xl md:text-2xl font-semibold">{summary.restaurantName}</h1>
              <p className="text-sm text-primary-100/80 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {summary.restaurantCity}
              </p>
            </div>
            <StatusBadge status={summary.status} />
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400 mb-1 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-primary-600" /> Reservation
              </p>
              <p className="text-sm font-semibold text-forest-900">{summary.reservationDateTime}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary-600" /> Party
              </p>
              <p className="text-sm font-semibold text-forest-900">{summary.partySize} guests</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400 mb-1.5">Your table</p>
            <div className="flex flex-wrap gap-2">
              {summary.tables.map((t) => (
                <span key={t.id} className="forest-chip !px-3 !py-1.5">
                  Table {t.tableNumber} · {t.capacity} seats · {t.zone}
                </span>
              ))}
            </div>
          </div>
          {summary.occasion && (
            <div className="rounded-xl bg-gold-50 border border-gold-200 p-4">
              <p className="text-sm font-semibold text-gold-800 flex items-center gap-1.5">
                <PartyPopper className="w-4 h-4" /> {summary.occasion.charAt(0) + summary.occasion.slice(1).toLowerCase()} celebration
              </p>
              {summary.celebrationNotes && <p className="text-xs text-gold-700 mt-1">“{summary.celebrationNotes}”</p>}
              {summary.addOns && summary.addOns.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {summary.addOns.map((a) => (
                    <span key={a.id} className="text-xs bg-white/70 border border-gold-200 rounded-full px-2.5 py-1 text-gold-800 font-medium">
                      {a.emoji} {a.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {summary.preOrder && summary.preOrder.items.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-forest-900 flex items-center gap-2 mb-3">
            <UtensilsCrossed className="w-4 h-4 text-primary-600" /> Your order
          </h2>
          <div className="divide-y divide-primary-100">
            {summary.preOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-sm">
                <span className="text-forest-700">{item.name} <span className="text-forest-400">× {item.quantity}</span></span>
                <span className="font-semibold text-forest-800">{formatINR(Number(item.unitPrice) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <p className="text-right mt-2 font-display font-semibold text-primary-700">Total: {formatINR(summary.preOrder.totalAmount)}</p>
        </div>
      )}

      {summary.waiterCalled && (
        <div className="card !p-4 flex items-center gap-3 text-sm text-primary-800 bg-primary-50/60 border-primary-200">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center shrink-0">
            <BellRingOn className="w-4 h-4" />
          </span>
          Waiter called — they've been notified and are heading over.
        </div>
      )}
      {summary.billRequested && (
        <div className="card !p-4 flex items-center gap-3 text-sm text-gold-800 bg-gold-50 border-gold-200">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-white flex items-center justify-center shrink-0">
            <Receipt className="w-4 h-4" />
          </span>
          Bill requested — your server will bring it right over.
        </div>
      )}

      {!seated ? (
        <div className="card p-6 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-primary-400 anim-float" />
          <p className="font-semibold text-forest-800 mb-1">See you at the table!</p>
          <p className="text-sm text-forest-500">
            The waiter and bill controls unlock as soon as the host seats your party. Scan back then.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <Button onClick={callWaiter} disabled={busy || summary.waiterCalled} className="w-full !py-4" size="lg">
            <BellRing className="w-5 h-5" />
            {summary.waiterCalled ? 'Waiter on the way' : 'Call a waiter'}
          </Button>
          <Button onClick={requestBill} disabled={busy || summary.billRequested} variant="gold" className="w-full !py-3.5">
            <Receipt className="w-5 h-5" />
            {summary.billRequested ? 'Bill requested' : 'Request the bill'}
          </Button>
          {summary.status === 'COMPLETED' && (
            <div className="card !p-4 flex items-center gap-3 text-sm text-emerald-700 bg-emerald-50 border-emerald-200">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Thanks for dining with us! See you next time.
            </div>
          )}
        </div>
      )}

      <p className="text-center text-xs text-forest-400">
        Confirmation code <span className="font-mono font-semibold text-primary-700">{summary.confirmationCode}</span>
      </p>
    </div>
  );
}
