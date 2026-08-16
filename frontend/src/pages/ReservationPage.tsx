import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CalendarDays, Users, UtensilsCrossed, CreditCard, ArrowRight, ArrowLeft,
  CheckCircle2, Plus, Minus, Table2, Clock, Flame, Leaf, ShoppingBag, MapPin, PartyPopper,
  Sparkles,
} from 'lucide-react';
import { restaurantAPI, slotAPI, tableAPI, reservationAPI, errorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Restaurant, TableSlot, RestaurantTable, MenuItem, OccasionAddOn } from '../types';
import Button from '../components/ui/Button';
import Stepper from '../components/ui/Stepper';
import { cn } from '../utils/cn';
import { formatINR, todayISO, time12 } from '../utils/format';
import { cuisineEmoji } from '../utils/cuisine';

type Step = 'slot' | 'preorder' | 'confirm';

const OCCASIONS = ['NONE', 'BIRTHDAY', 'ANNIVERSARY', 'HONEYMOON', 'CELEBRATION', 'FAMILY', 'BUSINESS'];

export default function ReservationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const restaurantId = Number(searchParams.get('restaurantId'));

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [date, setDate] = useState<string>(todayISO());
  const [partySize, setPartySize] = useState(2);
  const [slots, setSlots] = useState<TableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TableSlot | null>(null);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [activeCat, setActiveCat] = useState('all');
  const [order, setOrder] = useState<Map<number, number>>(new Map());
  const [step, setStep] = useState<Step>('slot');
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<{ reservationId: string; depositAmount: number } | null>(null);

  const [occasion, setOccasion] = useState('NONE');
  const [celebrationNotes, setCelebrationNotes] = useState('');
  const [addOns, setAddOns] = useState<OccasionAddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (occasion && occasion !== 'NONE') {
      reservationAPI.getAddOns(occasion)
        .then((res) => setAddOns(res.data.data))
        .catch(() => setAddOns([]));
    } else {
      setAddOns([]);
    }
  }, [occasion]);

  const toggleAddOn = (id: number) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addOnTotal = addOns
    .filter((a) => selectedAddOns.has(a.id))
    .reduce((sum, a) => sum + Number(a.price), 0);

  useEffect(() => {
    if (!restaurantId) return;
    setLoadFailed(false);
    restaurantAPI.getById(restaurantId)
      .then((res) => {
        setRestaurant(res.data.data);
        return restaurantAPI.getMenu(restaurantId);
      })
      .then((res) => setMenu(res.data.data))
      .catch(() => {
        setLoadFailed(true);
        toast.error('Could not load restaurant');
      });
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId || !date) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    setSelectedTable(null);
    slotAPI.getAvailable({ restaurantId, date, partySize })
      .then((res) => setSlots(res.data.data))
      .catch(() => toast.error('Could not load slots'))
      .finally(() => setLoadingSlots(false));
  }, [restaurantId, date, partySize]);

  const selectSlot = async (slot: TableSlot) => {
    setSelectedSlot(slot);
    try {
      const res = await tableAPI.getById(slot.tableId);
      setSelectedTable(res.data.data);
    } catch {
      toast.error('Could not load table details');
    }
  };

  const toggleItem = (id: number, delta: number) => {
    setOrder((prev) => {
      const next = new Map(prev);
      const current = next.get(id) ?? 0;
      const updated = current + delta;
      if (updated <= 0) next.delete(id);
      else next.set(id, updated);
      return next;
    });
  };

  const preOrderItems = Array.from(order.entries()).map(([menuItemId, quantity]) => ({ menuItemId, quantity }));

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedTable || !restaurant) return;
    setSubmitting(true);
    try {
      const res = await reservationAPI.create({
        restaurantId: restaurant.id,
        areaId: selectedTable.areaId,
        slotId: selectedSlot.id,
        partySize,
        tableIds: [selectedSlot.tableId],
        preOrderItems,
        occasion: occasion === 'NONE' ? undefined : occasion,
        celebrationNotes: celebrationNotes.trim() || undefined,
        addOns: Array.from(selectedAddOns).map((id) => ({ addOnId: id, quantity: 1 })),
      });
      const r = res.data.data;
      setCreated({ reservationId: r.reservationId, depositAmount: r.depositAmount });
      setStep('confirm');
      toast.success('Tables held! Complete the deposit to confirm.');
    } catch (err) {
      toast.error(errorMessage(err, 'Reservation failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async () => {
    if (!created) return;
    setSubmitting(true);
    try {
      await reservationAPI.confirm(created.reservationId);
      toast.success('Deposit paid. Reservation confirmed!');
      navigate(`/reservations/${created.reservationId}`);
    } catch (err) {
      toast.error(errorMessage(err, 'Payment failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const totalPreOrder = menu
    .filter((m) => order.has(m.id))
    .reduce((sum, m) => sum + Number(m.price) * (order.get(m.id) ?? 0), 0);

  const categories = Array.from(new Set(menu.map((m) => m.category).filter(Boolean)));

  const steps = [
    { key: 'slot', label: 'Pick a time', icon: Clock },
    { key: 'preorder', label: 'Pre-order', icon: UtensilsCrossed },
    { key: 'confirm', label: 'Confirm', icon: CheckCircle2 },
  ];
  const stepIndex = step === 'slot' ? 0 : step === 'preorder' ? 1 : 2;

  if (!restaurantId) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="card text-center py-16">
          <Table2 className="w-14 h-14 mx-auto mb-4 text-primary-500 anim-float" />
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-2">Pick a restaurant first</h2>
          <p className="text-forest-500 mb-6">Browse restaurants and hit “Book a Table” to get started.</p>
          <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="card text-center py-16">
          <UtensilsCrossed className="w-14 h-14 mx-auto mb-4 text-primary-400 anim-float" />
          <h2 className="font-display text-2xl font-semibold text-forest-900 mb-2">Could not load restaurant</h2>
          <p className="text-forest-500 mb-6">Please check back soon or pick another place.</p>
          <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <div className="space-y-4"><div className="card h-40 shimmer" /><div className="card h-80 shimmer" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 text-3xl flex items-center justify-center shrink-0">
            {cuisineEmoji(restaurant.cuisine)}
          </span>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-forest-900 leading-tight">
              Reserve at {restaurant.name}
            </h1>
            <p className="text-sm text-forest-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {restaurant.city} · {formatINR(restaurant.avgCostPerHead)} for two
            </p>
          </div>
        </div>
        {!created && (
          <Button variant="secondary" onClick={() => navigate(`/restaurants/${restaurant.id}`)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        )}
      </div>

      {!created && (
        <div className="card !py-4 px-5">
          <Stepper steps={steps} current={stepIndex} />
        </div>
      )}

      {created ? (
        <div className="card text-center py-14 animate-zoom-in relative overflow-hidden">
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-80 h-56 bg-gold-300/30 blur-3xl rounded-full" />
          <div className="relative">
            <span className="mx-auto mb-5 w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-800 text-white flex items-center justify-center shadow-glow anim-bounce-soft">
              <PartyPopper className="w-10 h-10" />
            </span>
            <h2 className="font-display text-3xl font-semibold text-forest-900 mb-2">Reservation held!</h2>
            <p className="text-forest-500 mb-2">
              Complete the deposit of{' '}
              <span className="font-bold text-primary-700">{formatINR(created.depositAmount)}</span> to confirm your table.
            </p>
            <p className="text-sm text-forest-400 mb-8 max-w-md mx-auto">
              Your table is locked for a short while. Confirm now to make it official.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={handlePay} disabled={submitting} size="lg">
                {submitting ? (
                  <span className="animate-pulse">Processing…</span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" /> Pay Deposit & Confirm
                  </>
                )}
              </Button>
              <Link to={`/reservations/${created.reservationId}`} className="btn-secondary btn-lg">
                View details
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ================= STEP 1: SLOT ================= */}
          {step === 'slot' && (
            <div className="space-y-5 animate-fade-up">
              <div className="card p-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-forest-800 mb-1.5 flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-primary-600" /> Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={todayISO()}
                      onChange={(e) => setDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-forest-800 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-primary-600" /> Party size
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                        className="w-11 h-11 rounded-xl bg-primary-100 hover:bg-primary-200 text-primary-700 flex items-center justify-center transition-colors"
                        aria-label="Decrease party size"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 text-center font-display text-xl font-semibold text-forest-900">
                        {partySize} {partySize === 1 ? 'guest' : 'guests'}
                      </span>
                      <button
                        onClick={() => setPartySize((n) => Math.min(12, n + 1))}
                        className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-white flex items-center justify-center shadow-glow transition-colors"
                        aria-label="Increase party size"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-primary-100 pt-5">
                  <label className="block text-sm font-semibold text-forest-800 mb-2 flex items-center gap-1.5">
                    <PartyPopper className="w-4 h-4 text-primary-600" /> Celebrating something?
                    <span className="text-xs font-medium text-forest-400">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {OCCASIONS.map((o) => (
                      <button
                        key={o}
                        onClick={() => { setOccasion(o); setSelectedAddOns(new Set()); }}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-semibold border transition-all',
                          occasion === o
                            ? 'bg-gradient-to-r from-primary-700 to-primary-600 text-white border-primary-700 shadow-glow'
                            : 'bg-white text-forest-600 border-primary-200 hover:border-primary-400',
                        )}
                      >
                        {o === 'NONE' ? 'No occasion' : o.charAt(0) + o.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>

                  {occasion !== 'NONE' && (
                    <div className="mt-4 animate-fade-up">
                      <input
                        className="input-field"
                        placeholder={'Any notes for the chef? (e.g. "Birthday surprise", "Prefer window seat")'}
                        value={celebrationNotes}
                        onChange={(e) => setCelebrationNotes(e.target.value)}
                      />
                      {addOns.length > 0 && (
                        <>
                          <p className="text-sm font-semibold text-forest-800 mt-4 mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-gold-600" /> Add-ons for your {occasion.toLowerCase()}
                          </p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {addOns.map((a) => {
                              const active = selectedAddOns.has(a.id);
                              return (
                                <button
                                  key={a.id}
                                  onClick={() => toggleAddOn(a.id)}
                                  className={cn(
                                    'rounded-xl border-2 p-3 text-left transition-all',
                                    active
                                      ? 'bg-gradient-to-br from-primary-700 to-primary-500 text-white border-primary-500 shadow-glow-lg'
                                      : 'bg-white/60 border-primary-100 hover:border-primary-400',
                                  )}
                                >
                                  <span className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-sm flex items-center gap-1.5">
                                      <span className="text-lg">{a.emoji}</span> {a.name}
                                    </span>
                                    <span className={cn('text-sm font-bold', active ? 'text-gold-200' : 'text-primary-700')}>
                                      {formatINR(a.price)}
                                    </span>
                                  </span>
                                  {a.description && (
                                    <span className={cn('block text-xs mt-1', active ? 'text-white/80' : 'text-forest-400')}>
                                      {a.description}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          {addOnTotal > 0 && (
                            <p className="text-sm text-forest-500 mt-3">
                              Add-ons total: <span className="font-bold text-primary-700">{formatINR(addOnTotal)}</span> (added to your deposit)
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-lg text-forest-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center"><Clock className="w-4 h-4" /></span>
                  Available time slots
                  <span className="text-xs font-medium text-forest-400 ml-auto">{slots.length} available</span>
                </h2>

                {loadingSlots ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 shimmer rounded-xl" />)}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-forest-400 mb-4">No slots available for this date and party size. Try another day.</p>
                    <button
                      onClick={() => {
                        if (isAuthenticated) {
                          reservationAPI.joinWaitlist({ restaurantId, partySize })
                            .then(() => toast.success('Added to the waitlist — we will notify you when a spot opens!'))
                            .catch((err) => toast.error(errorMessage(err, 'Could not join waitlist')));
                        } else {
                          toast('Please sign in to join the waitlist.', { icon: '🔔' });
                        }
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-50 border-2 border-gold-300 text-gold-800 font-semibold text-sm hover:bg-gold-100 hover:shadow-soft transition-all"
                    >
                      <Clock className="w-4 h-4" /> Join the waitlist
                    </button>
                    <p className="text-[11px] text-forest-400 mt-2">We'll ping you the moment a table frees up.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 stagger">
                    {slots.map((slot) => {
                      const selected = selectedSlot?.id === slot.id;
                      const cleaning = slot.cleaningStatus !== 'READY';
                      return (
                        <button
                          key={slot.id}
                          onClick={() => selectSlot(slot)}
                          className={cn(
                            'rounded-2xl p-4 text-left transition-all duration-300 border-2',
                            selected
                              ? 'bg-gradient-to-br from-primary-700 to-primary-500 text-white border-primary-500 shadow-glow-lg scale-[1.01]'
                              : 'border-primary-100 bg-white/60 hover:border-primary-400 hover:-translate-y-0.5 hover:shadow-soft',
                          )}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-display font-semibold text-lg">
                              {time12(slot.startTime)} – {time12(slot.endTime)}
                            </span>
                            <span className={cn('px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide', selected ? 'bg-white/20 text-gold-100' : 'bg-gold-50 text-gold-700')}>
                              {slot.sessionName}
                            </span>
                          </div>
                          <p className={cn('text-sm', selected ? 'text-white/85' : 'text-forest-500')}>
                            Table {slot.tableNumber} · Seats {slot.tableCapacity} · {slot.zone}
                          </p>
                          <p className={cn('text-xs mt-1.5 flex items-center gap-1', selected ? 'text-lime-200' : cleaning ? 'text-amber-600' : 'text-green-600')}>
                            {cleaning ? (
                              <>🫧 Table being prepared</>
                            ) : (
                              <><CheckCircle2 className="w-3 h-3" /> Ready for you</>
                            )}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep('preorder')}
                  disabled={!selectedSlot}
                  size="lg"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: PRE-ORDER ================= */}
          {step === 'preorder' && (
            <div className="grid lg:grid-cols-3 gap-5 animate-fade-up">
              <div className="lg:col-span-2 space-y-4">
                {menu.length === 0 ? (
                  <div className="card p-8 text-center">
                    <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-primary-400 anim-float" />
                    <p className="text-forest-600 font-medium">Menu not available yet.</p>
                    <p className="text-sm text-forest-400">You can still continue without pre-ordering.</p>
                  </div>
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

                    <div className="space-y-2.5">
                      {menu.filter((m) => (activeCat === 'all' || m.category === activeCat) && m.available).map((item) => {
                        const qty = order.get(item.id) ?? 0;
                        return (
                          <div key={item.id} className="card !p-4 flex items-center justify-between gap-3 transition-all hover:!border-primary-300">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-forest-900 truncate">{item.name}</p>
                                {item.spiceLevel ? (
                                  <span className="flex gap-0.5 shrink-0">
                                    {Array.from({ length: item.spiceLevel }).map((_, i) => <Flame key={i} className="w-3 h-3 text-red-500" />)}
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-xs text-forest-400 mt-0.5 flex items-center gap-2">
                                <span className="font-medium text-primary-700">{formatINR(item.price)}</span>
                                {item.dietaryTags && (
                                  <span className="inline-flex items-center gap-1 text-green-600"><Leaf className="w-3 h-3" /> {item.dietaryTags}</span>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => toggleItem(item.id, -1)}
                                disabled={qty === 0}
                                className="w-9 h-9 rounded-xl bg-primary-100 hover:bg-primary-200 text-primary-700 flex items-center justify-center disabled:opacity-40 transition-all"
                                aria-label="Decrease"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-7 text-center font-bold text-forest-900">{qty}</span>
                              <button
                                onClick={() => toggleItem(item.id, 1)}
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 hover:from-primary-700 text-white flex items-center justify-center shadow-glow transition-all"
                                aria-label="Increase"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <div className="card p-6 lg:sticky lg:top-24">
                  <h3 className="font-semibold text-lg text-forest-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary-600" /> Your order
                  </h3>
                  {order.size === 0 ? (
                    <p className="text-sm text-forest-400 text-center py-6">Nothing added yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1 mb-4">
                      {Array.from(order.entries()).map(([id, qty]) => {
                        const item = menu.find((m) => m.id === id);
                        if (!item) return null;
                        return (
                          <div key={id} className="flex items-center justify-between text-sm">
                            <span className="text-forest-700">
                              {item.name} <span className="text-forest-400">× {qty}</span>
                            </span>
                            <span className="font-semibold text-forest-800">{formatINR(Number(item.price) * qty)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                    <span className="font-semibold text-forest-800">Pre-order total</span>
                    <span className="font-display text-xl font-bold text-primary-700">{formatINR(totalPreOrder)}</span>
                  </div>
                </div>

                <div className="card !p-4 text-sm text-forest-500 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center shrink-0">
                    <Table2 className="w-4 h-4" />
                  </span>
                  {selectedSlot && selectedTable ? (
                    <span>
                      Table {selectedSlot.tableNumber} · {time12(selectedSlot.startTime)} · {selectedSlot.zone}
                    </span>
                  ) : (
                    <span>No table selected</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CONFIRM ================= */}
          {step === 'confirm' && (
            <div className="space-y-5 animate-fade-up">
              <div className="card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center shadow-glow">
                    <Table2 className="w-6 h-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-forest-900">Almost there!</h2>
                    <p className="text-sm text-forest-500">Review your booking before holding the table.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Restaurant', value: `${restaurant.name}, ${restaurant.city}` },
                    { label: 'Date & time', value: `${new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}, ${time12(selectedSlot?.startTime ?? '')}` },
                    { label: 'Party size', value: `${partySize} ${partySize === 1 ? 'guest' : 'guests'}` },
                    { label: 'Table', value: selectedSlot ? `Table ${selectedSlot.tableNumber} · ${selectedSlot.zone}` : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-primary-50/70 border border-primary-100 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400 mb-1">{label}</p>
                      <p className="font-semibold text-forest-800">{value}</p>
                    </div>
                  ))}
                </div>

                {totalPreOrder > 0 && (
                  <div className="mt-5 rounded-xl border border-primary-100 p-4">
                    <p className="font-semibold text-forest-800 mb-2 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary-600" /> Pre-order ({preOrderItems.length} item{preOrderItems.length === 1 ? '' : 's'})
                    </p>
                    <p className="text-sm text-forest-500">Total: <span className="font-semibold text-primary-700">{formatINR(totalPreOrder)}</span> (paid at restaurant)</p>
                  </div>
                )}

                {occasion !== 'NONE' && (
                  <div className="mt-5 rounded-xl bg-gold-50/70 border border-gold-200 p-4">
                    <p className="font-semibold text-gold-800 mb-1 flex items-center gap-2">
                      <PartyPopper className="w-4 h-4" /> {occasion.charAt(0) + occasion.slice(1).toLowerCase()} celebration
                    </p>
                    {celebrationNotes.trim() && <p className="text-sm text-gold-700 mb-2">“{celebrationNotes.trim()}”</p>}
                    {selectedAddOns.size > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {addOns.filter((a) => selectedAddOns.has(a.id)).map((a) => (
                          <span key={a.id} className="text-xs bg-white/70 border border-gold-200 rounded-full px-2.5 py-1 text-gold-800 font-medium">
                            {a.emoji} {a.name} · {formatINR(a.price)}
                          </span>
                        ))}
                        <span className="text-sm font-bold text-gold-800 ml-auto self-center">+ {formatINR(addOnTotal)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <Button variant="secondary" onClick={() => setStep('preorder')}>
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button onClick={handleConfirm} disabled={submitting} size="lg">
                    {submitting ? (
                      <span className="animate-pulse">Holding your table…</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" /> Hold Tables
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
