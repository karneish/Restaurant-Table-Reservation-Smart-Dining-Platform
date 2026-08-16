import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Users } from 'lucide-react';
import type { Restaurant } from '../types';
import { restaurantImage, cuisineEmoji } from '../utils/cuisine';
import { formatINR } from '../utils/format';
import RestaurantImage from './RestaurantImage';
import RatingStars from './ui/RatingStars';

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="group card card-hover overflow-hidden !p-0 flex flex-col"
    >
      <div className="relative h-44">
        <RestaurantImage
          src={restaurantImage(restaurant)}
          alt={restaurant.name}
          emoji={cuisineEmoji(restaurant.cuisine)}
          initial={restaurant.name}
          className="h-44 w-full"
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-semibold border border-white/20">
          {cuisineEmoji(restaurant.cuisine)} {restaurant.cuisine}
        </span>
        {!restaurant.active && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold">
            Unavailable
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display text-lg font-semibold text-forest-900 group-hover:text-primary-700 transition-colors leading-snug">
            {restaurant.name}
          </h3>
          <RatingStars rating={restaurant.rating} size={3.5} />
        </div>

        <div className="flex items-center gap-3 text-sm text-forest-500 mb-2.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {restaurant.city}
          </span>
          <span className="w-1 h-1 rounded-full bg-forest-200" />
          <span className="font-semibold text-primary-700">{formatINR(restaurant.avgCostPerHead)}</span>
          <span className="text-forest-300">for two</span>
        </div>

        {restaurant.description && (
          <p className="text-sm text-forest-400 line-clamp-2 flex-1 mb-4">{restaurant.description}</p>
        )}

        <span className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-primary-200 text-primary-700 text-sm font-semibold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary-700 group-hover:to-primary-500 group-hover:text-white group-hover:border-transparent group-hover:shadow-glow">
          Reserve a Table <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export function RestaurantCompact({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="group flex items-center gap-4 card card-hover !p-4"
    >
      <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 text-2xl flex items-center justify-center shrink-0">
        {cuisineEmoji(restaurant.cuisine)}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-forest-900 group-hover:text-primary-700 transition-colors truncate">{restaurant.name}</p>
        <p className="text-xs text-forest-400 flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3" /> {restaurant.city} &middot; {formatINR(restaurant.avgCostPerHead)} for two
        </p>
      </div>
      <Users className="w-4 h-4 text-forest-300 group-hover:text-primary-500 transition-colors" />
    </Link>
  );
}
