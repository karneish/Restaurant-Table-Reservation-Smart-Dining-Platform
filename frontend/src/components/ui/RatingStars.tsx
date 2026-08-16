import { Star } from 'lucide-react';

export default function RatingStars({ rating, size = 4, showValue = true }: { rating: number | null | undefined; size?: number; showValue?: boolean }) {
  const value = rating ?? 0;
  const filled = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={i <= filled ? 'text-gold-400 fill-gold-400' : 'text-forest-200'}
            style={{ width: size * 4, height: size * 4 }}
          />
        ))}
      </span>
      {showValue && <span className="text-sm font-semibold text-forest-700">{rating ?? 'N/A'}</span>}
    </span>
  );
}
