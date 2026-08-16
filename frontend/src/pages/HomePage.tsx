import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, CalendarDays, Users, UtensilsCrossed, ArrowRight, Leaf,
  Store, MapPin, Heart, CheckCircle2, Sparkles, Clock3,
} from 'lucide-react';
import { restaurantAPI } from '../services/api';
import type { Restaurant } from '../types';
import RestaurantCard from '../components/RestaurantCard';
import ParkBenchScene from '../components/ParkBenchScene';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { cuisineEmoji } from '../utils/cuisine';

export default function HomePage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    restaurantAPI.getActive()
      .then((res) => setRestaurants(res.data.data))
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, []);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/restaurants?q=${encodeURIComponent(query.trim())}` : '/restaurants');
  };

  const cities = Array.from(new Set(restaurants.map((r) => r.city).filter(Boolean)));
  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine).filter(Boolean)));
  const featured = [...restaurants].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 4);

  return (
    <div className="space-y-20">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 text-white anim-gradient shadow-card-lg">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary-400/25 blur-3xl anim-blob" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-gold-400/15 blur-3xl anim-blob" style={{ animationDelay: '-7s' }} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center p-8 md:p-14">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm animate-zoom-in">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" /> India&apos;s smartest dining platform
            </span>

            <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.08]">
              Reserve your{' '}
              <span className="anim-shimmer-text">perfect table</span>
              <span className="block mt-3 flex items-center gap-3 text-gold-300 anim-float-text text-2xl md:text-3xl">
                in the forest of flavour <Leaf className="w-8 h-8" />
              </span>
            </h1>

            <p className="text-lg text-primary-100/90 max-w-xl leading-relaxed">
              Discover top restaurants, pick your exact table, pre-order your favourites
              and skip the wait — all in a few taps.
            </p>

            <form onSubmit={submitSearch} className="max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-700" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search restaurants, cuisines, cities…"
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white/95 text-forest-900 placeholder:text-forest-400 shadow-card-lg outline-none focus:ring-4 focus:ring-gold-300/40 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-gold btn-sm"
                >
                  Explore
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-3 text-sm">
              <Link to="/restaurants" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all">
                <Store className="w-4 h-4 text-gold-300" /> {restaurants.length}+ restaurants
              </Link>
              {cities.map((c) => (
                <Link key={c} to={`/restaurants?city=${encodeURIComponent(c)}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-gold-300/50 hover:bg-white/10 transition-all">
                  <MapPin className="w-3.5 h-3.5 text-gold-300" /> {c}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in delay-4">
            <div className="relative z-10">
              <ParkBenchScene />
            </div>

            {/* floating glass cards */}
            <div className="absolute top-6 -left-4 glass rounded-2xl px-4 py-3 flex items-center gap-3 anim-float shadow-card-lg" style={{ width: 220 }}>
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-gold-900 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-forest-900 leading-tight">Table confirmed</p>
                <p className="text-xs text-forest-500">Seats 4 &middot; 7:30 PM</p>
              </div>
            </div>

            <div className="absolute bottom-8 -right-2 glass rounded-2xl px-4 py-3 flex items-center gap-3 anim-float shadow-card-lg" style={{ animationDelay: '-2.5s', width: 210 }}>
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-800 text-white flex items-center justify-center shrink-0">
                <Clock3 className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-forest-900 leading-tight">Zero waiting</p>
                <p className="text-xs text-forest-500">Pre-order served on arrival</p>
              </div>
            </div>

            <div className="absolute top-1/2 -right-6 glass rounded-full px-4 py-2 flex items-center gap-2 anim-float shadow-card-lg" style={{ animationDelay: '-4s' }}>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-sm font-semibold text-forest-800">4.8 avg rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section>
        <Reveal>
          <SectionHeading
            icon={Sparkles}
            eyebrow="Simple & fast"
            title="How TableHub works"
            subtitle="From search to seated in under a minute."
          />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 stagger">
          {[
            {
              icon: Search,
              step: '01',
              title: 'Discover',
              desc: 'Browse hand-picked restaurants and filter by cuisine, city or budget.',
            },
            {
              icon: Users,
              step: '02',
              title: 'Pick your table',
              desc: 'Choose a real table in your preferred area, date and time slot.',
            },
            {
              icon: CalendarDays,
              step: '03',
              title: 'Dine without waiting',
              desc: 'Pre-order, pay a small deposit and get seated the moment you arrive.',
            },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="card card-hover p-7 relative overflow-hidden group">
              <span className="absolute -top-3 -right-2 font-display text-7xl font-bold text-primary-100/70 group-hover:text-primary-200/70 transition-colors">
                {step}
              </span>
              <span className="relative mb-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center shadow-glow group-hover:rotate-6 transition-transform">
                <Icon className="w-7 h-7" />
              </span>
              <h3 className="font-display text-xl font-semibold text-forest-900 mb-2">{title}</h3>
              <p className="text-sm text-forest-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CUISINE MARQUEE ================= */}
      {cuisines.length > 0 && (
        <section>
          <div className="relative overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
            <div className="flex gap-4 w-max anim-marquee hover:[animation-play-state:paused]">
              {[...cuisines, ...cuisines].map((c, i) => (
                <Link
                  key={`${c}-${i}`}
                  to={`/restaurants?cuisine=${encodeURIComponent(c)}`}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 border border-primary-100 shadow-soft text-forest-700 font-semibold text-sm hover:border-gold-300 hover:shadow-gold hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-xl">{cuisineEmoji(c)}</span> {c}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= FEATURED ================= */}
      <section>
        <Reveal>
          <SectionHeading
            icon={UtensilsCrossed}
            eyebrow="Guest favourites"
            title="Trending restaurants"
            subtitle="Hand-picked places our guests love right now."
            action={
              <Link to="/restaurants" className="btn-secondary btn-sm">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
        </Reveal>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : featured.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No restaurants yet"
            description="We're seasoning the kitchen — restaurants will appear here soon."
            action={<Link to="/restaurants" className="btn-primary btn-sm">Browse Restaurants</Link>}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
            {featured.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* ================= CTA ================= */}
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border-gradient p-10 md:p-14 text-center">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-56 bg-gold-300/30 blur-3xl rounded-full" />
          <div className="relative">
            <span className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center shadow-glow anim-bounce-soft">
              <CalendarDays className="w-8 h-8" />
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-forest-900 mb-3">
              Hungry for a great table?
            </h2>
            <p className="text-forest-500 mb-7 max-w-lg mx-auto">
              Join thousands of happy diners who skip the queue every single day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/restaurants" className="btn-primary btn-lg">
                <UtensilsCrossed className="w-5 h-5" /> Explore Restaurants
              </Link>
              <Link to="/my-reservations" className="btn-secondary btn-lg">
                My Reservations <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
