import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Star, UtensilsCrossed, ConciergeBell, Lamp, MessageSquareHeart,
  CheckCircle2, Send, Sparkles,
} from 'lucide-react';
import { reservationAPI, errorMessage } from '../services/api';
import type { Reservation } from '../types';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/format';

const CATEGORIES = [
  { key: 'foodRating', label: 'Food', hint: 'Taste, freshness & presentation', icon: UtensilsCrossed },
  { key: 'serviceRating', label: 'Service', hint: 'Staff warmth & speed', icon: ConciergeBell },
  { key: 'ambienceRating', label: 'Ambience', hint: 'Setting, music & comfort', icon: Lamp },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]['key'];

function StarRow({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= (hover || value);
        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => { onChange(n); setHover(0); }}
            className="p-0.5 transition-transform duration-150 hover:scale-125 focus:outline-none"
          >
            <Star className={`w-7 h-7 ${active ? 'text-gold-500 fill-gold-400 drop-shadow-sm' : 'text-forest-200 fill-transparent'}`} />
          </button>
        );
      })}
    </div>
  );
}

export default function FeedbackPage() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [ratings, setRatings] = useState<Record<CategoryKey, number>>({
    foodRating: 0,
    serviceRating: 0,
    ambienceRating: 0,
  });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!reservationId) return;
    reservationAPI.getByReservationId(reservationId)
      .then((res) => setReservation(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [reservationId]);

  const allRated = CATEGORIES.every(({ key }) => ratings[key] >= 1);

  const submit = async () => {
    if (!reservationId || !allRated) return;
    setSubmitting(true);
    try {
      await reservationAPI.submitFeedback(reservationId, {
        foodRating: ratings.foodRating,
        serviceRating: ratings.serviceRating,
        ambienceRating: ratings.ambienceRating,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
      toast.success('Feedback sent — thank you!');
    } catch (err) {
      toast.error(errorMessage(err, 'Could not submit feedback'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="max-w-md mx-auto space-y-3"><div className="card h-40 shimmer" /><div className="card h-72 shimmer" /></div>;
  }

  if (notFound || !reservation) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center py-16">
          <MessageSquareHeart className="w-12 h-12 mx-auto mb-3 text-primary-400 anim-float" />
          <p className="text-forest-600 font-medium mb-4">We couldn't find this visit. Please scan the QR on your receipt again.</p>
          <Link to="/" className="btn-primary btn-sm">Back to TableHub</Link>
        </div>
      </div>
    );
  }

  /* ============ THANK YOU VIEW ============ */
  if (submitted) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card overflow-hidden p-0 shadow-card-lg animate-fade-up text-center">
          <div className="bg-gradient-to-br from-gold-400 to-gold-600 px-6 py-10">
            <span className="w-16 h-16 mx-auto rounded-full bg-white/25 flex items-center justify-center anim-float">
              <CheckCircle2 className="w-9 h-9 text-white" />
            </span>
            <h1 className="font-display text-2xl font-semibold text-white mt-4">Thank you!</h1>
            <p className="text-gold-50 text-sm mt-1">Your review helps other diners and means the world to {reservation.restaurantName}.</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`w-5 h-5 ${n <= Math.round((ratings.foodRating + ratings.serviceRating + ratings.ambienceRating) / 3)
                    ? 'text-gold-500 fill-gold-400'
                    : 'text-forest-200'}`}
                />
              ))}
            </div>
            <Link to="/restaurants" className="block">
              <Button variant="secondary" className="w-full">Explore more restaurants</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ============ GUARD — VISIT NOT COMPLETED ============ */
  if (reservation.status !== 'COMPLETED') {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center py-16">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary-400 anim-float" />
          <p className="font-semibold text-forest-800 mb-1">Almost there!</p>
          <p className="text-sm text-forest-500 mb-4">
            Feedback opens once your visit is completed. Current status:
            <span className="font-semibold text-primary-700"> {reservation.status}</span>.
          </p>
          <Link to={`/table/${reservation.reservationId}`} className="btn-primary btn-sm">Open dining companion</Link>
        </div>
      </div>
    );
  }

  /* ============ FORM ============ */
  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="card overflow-hidden p-0 shadow-card-lg">
        <div className="bg-gradient-to-br from-primary-800 to-primary-600 text-white px-6 py-5">
          <p className="text-[10px] uppercase tracking-widest text-primary-100/80 flex items-center gap-1.5">
            <MessageSquareHeart className="w-3 h-3" /> Guest feedback
          </p>
          <h1 className="font-display text-xl font-semibold">{reservation.restaurantName}</h1>
          <p className="text-sm text-primary-100/80">
            Visited {formatDate(reservation.reservationDateTime)} · Table{' '}
            {reservation.tables.map((t) => t.tableNumber).join(', ')}
          </p>
        </div>

        <div className="px-6 py-5 space-y-5">
          {CATEGORIES.map(({ key, label, hint, icon: Icon }) => (
            <div key={key} className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-forest-900">{label}</p>
                  {ratings[key] > 0 && (
                    <span className="text-xs font-bold text-gold-600">{ratings[key]}/5</span>
                  )}
                </div>
                <p className="text-xs text-forest-400 mb-1.5">{hint}</p>
                <StarRow
                  value={ratings[key]}
                  onChange={(v) => setRatings((prev) => ({ ...prev, [key]: v }))}
                />
              </div>
            </div>
          ))}

          <div>
            <label htmlFor="feedback-comment" className="text-[11px] font-bold uppercase tracking-wider text-forest-400 block mb-1.5">
              Anything to share? (optional)
            </label>
            <textarea
              id="feedback-comment"
              rows={3}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="The paneer tikka was incredible, and our host made the evening special…"
              className="input-field resize-none"
            />
            <p className="text-right text-[11px] text-forest-300 mt-1">{comment.length}/500</p>
          </div>
        </div>
      </div>

      <Button onClick={submit} disabled={!allRated || submitting} className="w-full !py-4" size="lg">
        <Send className="w-5 h-5" />
        {submitting ? 'Sending…' : allRated ? 'Send feedback' : 'Rate all three to continue'}
      </Button>
      <p className="text-center -mt-2 text-xs text-forest-400">
        Your rating updates this restaurant's live TableHub score.
      </p>
    </div>
  );
}
