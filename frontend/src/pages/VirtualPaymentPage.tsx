import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Receipt, ShieldCheck, Smartphone, CreditCard, Banknote,
  CheckCircle2, MapPin, Users, Table2, ArrowRight, Sparkles, Lock,
} from 'lucide-react';
import { reservationAPI, errorMessage } from '../services/api';
import type { Bill } from '../types';
import Button from '../components/ui/Button';
import { formatINR, formatDateTime } from '../utils/format';

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', hint: 'GPay · PhonePe · Paytm', icon: Smartphone },
  { id: 'CARD', label: 'Card', hint: 'Credit / debit card', icon: CreditCard },
  { id: 'CASH', label: 'Cash at counter', hint: 'Pay the server directly', icon: Banknote },
] as const;

export default function VirtualPaymentPage() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [method, setMethod] = useState<string>('UPI');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!reservationId) return;
    reservationAPI.companion.getBill(reservationId)
      .then((res) => setBill(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [reservationId]);

  const pay = async () => {
    if (!reservationId) return;
    setPaying(true);
    try {
      const res = await reservationAPI.companion.payBill(reservationId, method);
      setBill(res.data.data);
      toast.success('Bill settled — thank you!');
    } catch (err) {
      toast.error(errorMessage(err, 'Payment failed. Please try again.'));
      reservationAPI.companion.getBill(reservationId)
        .then((res) => setBill(res.data.data))
        .catch(() => undefined);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <div className="max-w-md mx-auto space-y-3"><div className="card h-56 shimmer" /><div className="card h-72 shimmer" /></div>;
  }

  if (notFound || !bill) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center py-16">
          <Receipt className="w-12 h-12 mx-auto mb-3 text-primary-400 anim-float" />
          <p className="text-forest-600 font-medium mb-4">We couldn't open this bill. Please scan the QR on your table again.</p>
          <Link to="/" className="btn-primary btn-sm">Back to TableHub</Link>
        </div>
      </div>
    );
  }

  /* ============ PAID — receipt view ============ */
  if (bill.paid) {
    return (
      <div className="max-w-md mx-auto space-y-5">
        <div className="card overflow-hidden p-0 shadow-card-lg animate-fade-up">
          <div className="bg-gradient-to-br from-green-600 to-emerald-500 text-white px-6 py-7 text-center">
            <span className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3 anim-float">
              <CheckCircle2 className="w-9 h-9" />
            </span>
            <h1 className="font-display text-2xl font-semibold">Payment successful</h1>
            <p className="text-green-50/90 text-sm mt-1">{bill.restaurantName} thanks you for your visit</p>
            <p className="font-display text-4xl font-bold mt-4 tracking-tight">{formatINR(bill.billAmount ?? bill.amountDue)}</p>
            <p className="text-xs uppercase tracking-widest text-white/70 mt-2">Paid via {bill.paymentMethod}</p>
          </div>
          <div className="px-6 py-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-forest-500">Transaction ID</span><span className="font-mono font-semibold text-forest-800">{bill.transactionId}</span></div>
            <div className="flex justify-between"><span className="text-forest-500">Paid at</span><span className="font-semibold text-forest-800">{bill.paidAt ? formatDateTime(bill.paidAt) : '—'}</span></div>
            <div className="flex justify-between"><span className="text-forest-500">Tables</span><span className="font-semibold text-forest-800">{bill.tableNumbers.join(', ')}</span></div>
            <div className="flex justify-between"><span className="text-forest-500">Confirmation code</span><span className="font-mono font-semibold text-primary-700">{bill.confirmationCode}</span></div>
            <div className="rounded-xl bg-primary-50/70 border border-primary-100 p-3 flex items-start gap-2 text-xs text-primary-800">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              Your visit is complete. Scan the feedback QR or tap below to rate your experience.
            </div>
          </div>
        </div>
        <Link to={`/feedback/${bill.reservationId}`} className="block">
          <Button variant="gold" className="w-full !py-4" size="lg">
            Rate your experience <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Link to={`/table/${bill.reservationId}`} className="block text-center text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline">
          Back to dining companion
        </Link>
      </div>
    );
  }

  /* ============ UNPAID — pay view ============ */
  const nothingDue = Number(bill.amountDue) <= 0;

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="card overflow-hidden p-0 shadow-card-lg">
        <div className="bg-gradient-to-br from-primary-800 to-primary-600 text-white px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-primary-100/80 flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Virtual QR payment
              </p>
              <h1 className="font-display text-xl font-semibold">{bill.restaurantName}</h1>
              <p className="text-sm text-primary-100/80 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {bill.restaurantCity}</p>
            </div>
            <span className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </span>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-forest-500">
            <span className="forest-chip !px-2.5 !py-1 font-mono">{bill.confirmationCode}</span>
            {bill.tableNumbers.map((t) => (
              <span key={t} className="forest-chip !px-2.5 !py-1"><Table2 className="w-3 h-3 inline mr-1" />{t}</span>
            ))}
          </div>

          {bill.lines.length > 0 ? (
            <div className="divide-y divide-primary-100 border-y border-primary-100">
              {bill.lines.map((line, i) => (
                <div key={i} className="flex justify-between py-2.5 text-sm">
                  <span className="text-forest-700 pr-3">
                    {line.description}
                    {line.quantity > 1 && <span className="text-forest-400"> × {line.quantity}</span>}
                  </span>
                  <span className="font-semibold text-forest-800 whitespace-nowrap">{formatINR(line.total)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-forest-400 border-y border-primary-100 py-4 text-center">No food or add-on charges this visit.</p>
          )}

          <div className="space-y-1.5 pt-4 text-sm">
            <div className="flex justify-between text-forest-600"><span>Subtotal</span><span>{formatINR(bill.subtotal)}</span></div>
            <div className="flex justify-between text-green-700"><span>Deposit already paid (credited)</span><span>-{formatINR(bill.depositPaid)}</span></div>
            <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-primary-200 mt-2">
              <span className="font-semibold text-forest-900">Amount due</span>
              <span className={`font-display text-2xl font-bold ${nothingDue ? 'text-green-700' : 'text-primary-700'}`}>
                {formatINR(bill.amountDue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {nothingDue ? (
        <div className="card !p-5 flex items-center gap-3 text-sm text-green-800 bg-green-50 border-green-200">
          <ShieldCheck className="w-6 h-6 shrink-0" />
          Your deposit covers this visit — nothing more to pay. Enjoy the rest of your meal!
        </div>
      ) : (
        <>
          <div className="card p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400 mb-3">Choose payment method</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(({ id, label, hint, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
                    method === id
                      ? 'border-primary-500 bg-primary-50 shadow-glow ring-1 ring-primary-400'
                      : 'border-primary-100 bg-white hover:border-primary-300'
                  }`}
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    method === id ? 'bg-gradient-to-br from-primary-600 to-primary-800 text-white' : 'bg-primary-50 text-primary-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-forest-900">{label}</span>
                    <span className="block text-xs text-forest-400">{hint}</span>
                  </span>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    method === id ? 'border-primary-600' : 'border-forest-200'
                  }`}>
                    {method === id && <span className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={pay} disabled={paying} className="w-full !py-4" size="lg">
            <ShieldCheck className="w-5 h-5" />
            {paying ? 'Processing payment…' : `Pay ${formatINR(bill.amountDue)} securely`}
          </Button>
          <p className="text-center text-xs text-forest-400 flex items-center justify-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Paying closes your visit automatically — tables are freed for cleaning.
          </p>
        </>
      )}
    </div>
  );
}
