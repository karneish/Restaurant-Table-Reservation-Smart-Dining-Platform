import React, { useState } from 'react';
import { Star } from 'lucide-react';
interface Props { rating: number; onRate?: (r: number) => void; readonly?: boolean; size?: number; showLabel?: boolean; }
const StarRating: React.FC<Props> = ({ rating, onRate, readonly = false, size = 24, showLabel = false }) => {
  const [hovered, setHovered] = useState(0);
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const display = hovered || rating;
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(star => (
          <button key={star} type="button" disabled={readonly}
            className={`transition-transform ${!readonly ? 'cursor-pointer hover:scale-110' : ''}`}
            onMouseEnter={() => !readonly && setHovered(star)} onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => onRate?.(star)} aria-label={`Rate ${star} stars`}>
            <Star size={size} className={star <= display ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
          </button>
        ))}
      </div>
      {showLabel && display > 0 && <span className="text-sm text-gray-500 ml-1">{labels[display]}</span>}
    </div>
  );
};
export default StarRating;
