import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, MapPin, ArrowRight, BookOpen, UtensilsCrossed, ListFilter } from 'lucide-react';
import { reservationAPI } from '../services/api';
import type { Reservation } from '../types';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { SkeletonRow } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { formatDateTime } from '../utils/format';
import { cn } from '../utils/cn';

const FILTERS = ['ALL', 'HOLD', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'];

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    reservationAPI.getByUser()
      .then((res) => setReservations(res.data.data))
      .catch(() => setReservations([]))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(
    () => [...reservations].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [reservations],
  );

  const visible = filter === 'ALL' ? sorted : sorted.filter((r) => r.status === filter);

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: sorted.length };
    sorted.forEach((r) => { map[r.status] = (map[r.status] ?? 0) + 1; });
    return map;
  }, [sorted]);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={BookOpen}
        title="My Reservations"
        eyebrow="Your table"
        subtitle="Track your upcoming dining plans and confirmations."
      />

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap',
              filter === f
                ? 'bg-primary-700 text-white border-primary-700 shadow-glow'
                : 'bg-white text-forest-600 border-primary-200 hover:border-primary-400',
            )}
          >
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            <span className="ml-1.5 text-xs opacity-70">({counts[f] ?? 0})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonRow count={4} />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No reservations yet"
          description="Book a table and it will show up here, ready to track."
          action={<Link to="/restaurants" className="btn-primary btn-sm">Find a Restaurant</Link>}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={ListFilter}
          title="Nothing in this view"
          description="Try a different status filter."
          action={<Button variant="secondary" onClick={() => setFilter('ALL')}>Show all</Button>}
        />
      ) : (
        <div className="space-y-3 stagger">
          {visible.map((r) => (
            <Link
              key={r.reservationId}
              to={`/reservations/${r.reservationId}`}
              className="card card-hover !p-5 flex flex-wrap items-center gap-4 group"
            >
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center shadow-glow shrink-0">
                <UtensilsCrossed className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-[210px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-lg font-semibold text-forest-900 group-hover:text-primary-700 transition-colors">
                    {r.restaurantName}
                  </h3>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-forest-500 mt-1.5">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-primary-500" /> {formatDateTime(r.reservationDateTime)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary-500" /> {r.partySize} guests
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary-500" /> {r.restaurantCity}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] uppercase tracking-wider text-forest-400 font-semibold">Code</p>
                <p className="font-mono font-bold text-primary-700 text-sm">{r.confirmationCode}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
