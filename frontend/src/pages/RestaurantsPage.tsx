import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Compass, ArrowUpDown, X } from 'lucide-react';
import { restaurantAPI } from '../services/api';
import type { Restaurant } from '../types';
import RestaurantCard from '../components/RestaurantCard';
import PageHeader from '../components/PageHeader';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { cuisineEmoji } from '../utils/cuisine';

type SortKey = 'rating' | 'costAsc' | 'costDesc' | 'name';

const SORT_LABELS: Record<SortKey, string> = {
  rating: 'Top rated',
  costAsc: 'Cost: Low to high',
  costDesc: 'Cost: High to low',
  name: 'Name (A–Z)',
};

export default function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const cuisine = searchParams.get('cuisine') ?? '';
  const city = searchParams.get('city') ?? '';

  const [all, setAll] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>('rating');

  useEffect(() => {
    setLoading(true);
    const p = q ? restaurantAPI.search(q) : restaurantAPI.getActive();
    p.then((res) => setAll(res.data.data))
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, [q]);

  const cuisines = useMemo(
    () => Array.from(new Set(all.map((r) => r.cuisine).filter(Boolean))).sort(),
    [all],
  );
  const cities = useMemo(
    () => Array.from(new Set(all.map((r) => r.city).filter(Boolean))).sort(),
    [all],
  );

  const filtered = useMemo(() => {
    let list = all;
    if (cuisine) list = list.filter((r) => r.cuisine === cuisine);
    if (city) list = list.filter((r) => r.city === city);
    switch (sort) {
      case 'rating':
        list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'costAsc':
        list = [...list].sort((a, b) => Number(a.avgCostPerHead) - Number(b.avgCostPerHead));
        break;
      case 'costDesc':
        list = [...list].sort((a, b) => Number(b.avgCostPerHead) - Number(a.avgCostPerHead));
        break;
      case 'name':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [all, cuisine, city, sort]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams(new URLSearchParams());
  const hasFilters = Boolean(q || cuisine || city);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={SlidersHorizontal}
        title="Restaurants"
        eyebrow="Discover & dine"
        subtitle="Find the perfect spot — filter by cuisine, city or budget."
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
          <input
            value={q}
            onChange={(e) => updateParam('q', e.target.value)}
            className="input-field pl-11 w-64 md:w-80 bg-white/90 !border-white/25 placeholder:text-white/60 text-white"
            placeholder="Search restaurants…"
          />
        </div>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <select
            value={cuisine}
            onChange={(e) => updateParam('cuisine', e.target.value)}
            className="select-field !w-40 !py-2.5"
          >
            <option value="">All cuisines</option>
            {cuisines.map((c) => (
              <option key={c} value={c}>{cuisineEmoji(c)} {c}</option>
            ))}
          </select>
          <select
            value={city}
            onChange={(e) => updateParam('city', e.target.value)}
            className="select-field !w-40 !py-2.5"
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="select-field !w-44 !py-2.5"
            aria-label="Sort restaurants"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <option key={k} value={k}>{SORT_LABELS[k]}</option>
            ))}
          </select>
        </div>

        <span className="ml-auto flex items-center gap-2 text-sm text-forest-500 font-medium">
          <ArrowUpDown className="w-4 h-4 text-primary-500" />
          {loading ? 'Loading…' : `${filtered.length} restaurant${filtered.length === 1 ? '' : 's'}`}
        </span>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No restaurants found"
          description="Try a different search or explore more of the forest."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              <MapPin className="w-4 h-4" /> Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
