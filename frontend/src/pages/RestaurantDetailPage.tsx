import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Clock, IndianRupee, UtensilsCrossed, CalendarDays,
  Leaf, Flame, ArrowLeft, ChefHat,   LayoutGrid, Info, Grid3x3, Users2,
  Accessibility, Moon, ArrowRight, Store,
} from 'lucide-react';
import { restaurantAPI, tableAPI } from '../services/api';
import type { Restaurant, MenuItem, DiningArea, RestaurantTable } from '../types';
import { formatINR, time12 } from '../utils/format';
import { restaurantImage, cuisineEmoji } from '../utils/cuisine';
import RestaurantImage from '../components/RestaurantImage';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { SkeletonRow } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { cn } from '../utils/cn';

type Tab = 'overview' | 'menu' | 'areas';

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const restaurantId = Number(id);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [areas, setAreas] = useState<DiningArea[]>([]);
  const [tablesByArea, setTablesByArea] = useState<Record<number, RestaurantTable[]>>({});
  const [activeCat, setActiveCat] = useState<string>('all');
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;
    setLoading(true);
    setFailed(false);
    Promise.all([
      restaurantAPI.getById(restaurantId),
      restaurantAPI.getMenu(restaurantId),
      tableAPI.getAreas(restaurantId),
    ])
      .then(([rRes, mRes, aRes]) => {
        setRestaurant(rRes.data.data);
        setMenu(mRes.data.data);
        setAreas(aRes.data.data);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  useEffect(() => {
    if (tab !== 'areas' || areas.length === 0) return;
    let cancelled = false;
    Promise.all(
      areas.map(async (a) => {
        const res = await tableAPI.getTablesByArea(a.id);
        return { areaId: a.id, tables: res.data.data };
      }),
    )
      .then((results) => {
        if (cancelled) return;
        const map: Record<number, RestaurantTable[]> = {};
        results.forEach((r) => (map[r.areaId] = r.tables));
        setTablesByArea(map);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [tab, areas]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card overflow-hidden">
          <div className="h-64 shimmer" />
        </div>
        <SkeletonRow count={4} />
      </div>
    );
  }

  if (failed || !restaurant) {
    return (
      <EmptyState
        icon={Store}
        title="Restaurant not found"
        description="It may have moved to another part of the forest."
        action={<Link to="/restaurants" className="btn-primary btn-sm">Back to Restaurants</Link>}
      />
    );
  }

  const categories = Array.from(new Set(menu.map((m) => m.category).filter(Boolean)));
  const visibleMenu = activeCat === 'all' ? menu : menu.filter((m) => m.category === activeCat);
  const totalTables = areas.reduce((acc, a) => acc + (tablesByArea[a.id]?.length ?? 0), 0);

  const tabs: { key: Tab; label: string; icon: typeof Info }[] = [
    { key: 'overview', label: 'Overview', icon: Info },
    { key: 'menu', label: `Menu (${menu.length})`, icon: UtensilsCrossed },
    { key: 'areas', label: `Areas & Tables (${totalTables})`, icon: Grid3x3 },
  ];

  return (
    <div className="space-y-8">
      <Link to="/restaurants" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Restaurants
      </Link>

      {/* ================= BANNER ================= */}
      <section className="relative overflow-hidden rounded-[2rem] bg-primary-950 text-white shadow-card-lg">
        <div className="relative h-64 md:h-80">
          <RestaurantImage
            src={restaurantImage(restaurant)}
            alt={restaurant.name}
            emoji={cuisineEmoji(restaurant.cuisine)}
            className="h-64 md:h-80 w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/40 to-transparent" />
        </div>

        <div className="relative z-10 -mt-24 px-6 md:px-10 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-sm font-semibold backdrop-blur-sm">
                  {cuisineEmoji(restaurant.cuisine)} {restaurant.cuisine}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm backdrop-blur-sm">
                  <MapPin className="w-3.5 h-3.5 text-gold-300" /> {restaurant.city}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight">{restaurant.name}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-100/90">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-gold-300 fill-gold-300" /> {restaurant.rating ?? 'N/A'} rating
                </span>
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4" /> {formatINR(restaurant.avgCostPerHead)} for two
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {restaurant.openHours}
                </span>
              </div>
            </div>

            <Button onClick={() => navigate(`/reserve?restaurantId=${restaurant.id}`)} className="!bg-white !text-primary-800 hover:!bg-gold-50 hover:shadow-gold shadow-card-lg !px-8 !py-3.5">
              <CalendarDays className="w-5 h-5" /> Book a Table
            </Button>
          </div>
        </div>
      </section>

      {/* ================= TABS ================= */}
      <div className="flex gap-1.5 bg-white/70 border border-primary-100 rounded-2xl p-1.5 w-fit shadow-soft">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300',
              tab === key
                ? 'bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-glow'
                : 'text-forest-600 hover:bg-primary-50',
            )}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6 animate-fade-up">
          <div className="card p-7">
            <h2 className="font-display text-xl font-semibold text-forest-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-600" /> About
            </h2>
            <p className="text-forest-600 leading-relaxed">
              {restaurant.description || 'A delightful dining experience awaits. Visit us to explore our carefully crafted menu and warm hospitality.'}
            </p>
            {restaurant.features && (
              <div className="flex flex-wrap gap-2 mt-5">
                {restaurant.features.split(',').map((f) => (
                  <span key={f} className="forest-chip !px-3 !py-1.5">{f.trim()}</span>
                ))}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            {[
              { icon: Clock, label: 'Open hours', value: restaurant.openHours },
              { icon: MapPin, label: 'Address', value: restaurant.address },
              { icon: IndianRupee, label: 'Avg. cost', value: `${formatINR(restaurant.avgCostPerHead)} for two` },
              { icon: LayoutGrid, label: 'Dining areas', value: String(areas.length) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card card-hover p-5">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-forest-400 mb-1">{label}</p>
                <p className="text-sm font-medium text-forest-800 leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'menu' && (
        <div className="space-y-6 animate-fade-up">
          {menu.length === 0 ? (
            <EmptyState icon={ChefHat} title="Menu coming soon" description="Our chefs are finalising the menu for this restaurant." />
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                  onClick={() => setActiveCat('all')}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap',
                    activeCat === 'all' ? 'bg-primary-700 text-white border-primary-700 shadow-glow' : 'bg-white text-forest-600 border-primary-200 hover:border-primary-400',
                  )}
                >
                  All ({menu.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-semibold border transition-all whitespace-nowrap',
                      activeCat === c ? 'bg-primary-700 text-white border-primary-700 shadow-glow' : 'bg-white text-forest-600 border-primary-200 hover:border-primary-400',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4 stagger">
                {visibleMenu.filter((m) => m.available).map((item) => (
                  <div key={item.id} className="card card-hover !p-5 flex items-start justify-between gap-4 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-forest-900 group-hover:text-primary-700 transition-colors">{item.name}</h3>
                        {item.spiceLevel ? (
                          <span className="flex items-center gap-0.5" title="Spice level">
                            {Array.from({ length: item.spiceLevel }).map((_, i) => (
                              <Flame key={i} className="w-3.5 h-3.5 text-red-500" />
                            ))}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-forest-500 mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {item.dietaryTags && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-medium">
                            <Leaf className="w-3 h-3" /> {item.dietaryTags}
                          </span>
                        )}
                        {item.prepTimeMinutes ? (
                          <span className="text-xs text-forest-400 font-medium">{item.prepTimeMinutes} min</span>
                        ) : null}
                      </div>
                    </div>
                    <span className="font-display font-semibold text-primary-700 text-lg whitespace-nowrap">
                      {formatINR(item.price)}
                    </span>
                  </div>
                ))}
              </div>
              {visibleMenu.filter((m) => m.available).length === 0 && (
                <p className="text-center text-forest-400 py-8">No items in this category.</p>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'areas' && (
        <div className="space-y-6 animate-fade-up">
          {areas.length === 0 ? (
            <EmptyState icon={Grid3x3} title="No areas configured yet" description="Dining areas will be available here soon." />
          ) : (
            <div className="grid md:grid-cols-2 gap-5 stagger">
              {areas.map((area) => {
                const tables = tablesByArea[area.id] ?? [];
                return (
                  <div key={area.id} className="card p-6">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display text-lg font-semibold text-forest-900 flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-primary-600" /> {area.name}
                      </h3>
                      <span className="gold-chip">{tables.length} table{tables.length === 1 ? '' : 's'}</span>
                    </div>
                    {area.description && <p className="text-sm text-forest-500 mb-3">{area.description}</p>}
                    {tables.length === 0 ? (
                      <p className="text-sm text-forest-300 py-2">No tables added yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tables.map((t) => (
                          <span key={t.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 border border-primary-200 text-xs font-semibold text-primary-800">
                            <Users2 className="w-3.5 h-3.5" /> {t.tableNumber} · {t.capacity} seats
                            {t.wheelchairAccessible && <Accessibility className="w-3 h-3 text-primary-500" />}
                            {t.quietCorner && <Moon className="w-3 h-3 text-primary-500" />}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'overview' && (
        <div className="flex justify-end">
          <Button onClick={() => navigate(`/reserve?restaurantId=${restaurant.id}`)} className="btn-lg">
            <CalendarDays className="w-5 h-5" /> Book a Table at {restaurant.name}
          </Button>
        </div>
      )}

      {tab === 'menu' && (
        <div className="flex justify-end">
          <Button onClick={() => navigate(`/reserve?restaurantId=${restaurant.id}`)} className="btn-lg">
            <CalendarDays className="w-5 h-5" /> Pre-order when you book
          </Button>
        </div>
      )}

      {restaurant.openHours && (
        <p className="text-xs text-forest-300 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Opening today: {restaurant.openHours}
        </p>
      )}
    </div>
  );
}
