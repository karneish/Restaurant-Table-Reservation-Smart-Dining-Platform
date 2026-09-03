import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import {
  Store, UtensilsCrossed, Grid3x3, Table2, Clock, CalendarDays,
  Plus, Trash2, CheckCircle2, ChefHat, Leaf, ShieldAlert, Search, Users2, Radio, MessageSquareHeart, Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { restaurantAPI, tableAPI, slotAPI, reservationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Restaurant, MenuItem, DiningArea, RestaurantTable, Reservation, TableSlot, FeedbackRecord } from '../types';
import PageHeader from '../components/PageHeader';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import { cn } from '../utils/cn';
import { formatDateTime, formatINR, todayISO } from '../utils/format';

type Tab = 'restaurants' | 'menu' | 'areas' | 'tables' | 'slots' | 'reservations' | 'feedback' | 'live';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('restaurants');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    Promise.all([restaurantAPI.getAll(), reservationAPI.getAll()])
      .then(([rRes, resRes]) => {
        setRestaurants(rRes.data.data);
        setReservations(resRes.data.data);
      })
      .catch(() => undefined)
      .finally(() => setStatsLoading(false));
  }, []);

  const holds = reservations.filter((r) => r.status === 'HOLD').length;
  const confirmed = reservations.filter((r) => r.status === 'CONFIRMED').length;
  const activeRestaurants = restaurants.filter((r) => r.active).length;

  const tabs: { key: Tab; label: string; icon: LucideIcon }[] = [
    { key: 'restaurants', label: 'Restaurants', icon: Store },
    { key: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { key: 'areas', label: 'Areas', icon: Grid3x3 },
    { key: 'tables', label: 'Tables', icon: Table2 },
    { key: 'slots', label: 'Slots', icon: Clock },
    { key: 'reservations', label: 'Reservations', icon: CalendarDays },
    { key: 'feedback', label: 'Feedback', icon: MessageSquareHeart },
    { key: 'live', label: 'Live Ops', icon: Radio },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Leaf}
        title="Admin Dashboard"
        eyebrow="Control panel"
        subtitle="Manage restaurants, menus, dining areas, tables, slots and reservations."
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/20 border border-gold-300/40 text-gold-100 text-sm font-semibold">
          <ShieldAlert className="w-4 h-4" /> Admin only
        </span>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Store} label="Restaurants" value={statsLoading ? '—' : restaurants.length} suffix={` (${activeRestaurants} active)`} />
        <StatCard icon={CalendarDays} label="Total reservations" value={statsLoading ? '—' : reservations.length} />
        <StatCard icon={Clock} label="Awaiting deposit" value={statsLoading ? '—' : holds} accent="gold" />
        <StatCard icon={CheckCircle2} label="Confirmed" value={statsLoading ? '—' : confirmed} />
      </div>

      <div className="flex gap-1.5 bg-white/70 border border-primary-100 rounded-2xl p-1.5 w-fit shadow-soft flex-wrap">
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

      <div key={tab} className="animate-fade-up">
        {tab === 'restaurants' && <RestaurantsTab onChanged={() => {
          restaurantAPI.getAll().then((r) => setRestaurants(r.data.data)).catch(() => undefined);
        }} />}
        {tab === 'menu' && <MenuTab />}
        {tab === 'areas' && <AreasTab />}
        {tab === 'tables' && <TablesTab />}
        {tab === 'slots' && <SlotsTab />}
        {tab === 'reservations' && <ReservationsTab />}
        {tab === 'feedback' && <FeedbackTab />}
        {tab === 'live' && <LiveOpsTab />}
      </div>
    </div>
  );
}

/* ==================== TAB WRAPPERS ==================== */

function TabCard({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-semibold text-forest-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ==================== RESTAURANTS ==================== */

const emptyRestaurant = { name: '', cuisine: '', city: '', address: '', rating: 4.0, avgCostPerHead: 500, openHours: '10:00 AM - 11:00 PM', description: '', features: '' };

function RestaurantsTab({ onChanged }: { onChanged: () => void }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [form, setForm] = useState({ ...emptyRestaurant });
  const [loading, setLoading] = useState(true);

  const load = () => {
    restaurantAPI.getAll()
      .then((res) => { setRestaurants(res.data.data); onChanged(); })
      .catch(() => toast.error('Failed to load restaurants'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const create = async () => {
    if (!form.name || !form.cuisine || !form.city) {
      toast.error('Name, cuisine and city are required');
      return;
    }
    try {
      await restaurantAPI.create(form);
      toast.success('Restaurant created');
      setForm({ ...emptyRestaurant });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create');
    }
  };

  const toggle = async (r: Restaurant) => {
    if (!window.confirm(r.active ? `Deactivate "${r.name}"?` : `Activate "${r.name}"?`)) return;
    try {
      if (r.active) {
        await restaurantAPI.remove(r.id);
        toast.success('Restaurant deactivated');
      } else {
        await restaurantAPI.update(r.id, { ...r, active: true });
        toast.success('Restaurant activated');
      }
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <TabCard title="Add restaurant" icon={Plus}>
        <div className="grid md:grid-cols-3 gap-3">
          <input className="input-field" placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input-field" placeholder="Cuisine *" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} />
          <input className="input-field" placeholder="City *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input className="input-field md:col-span-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input className="input-field" placeholder="Open hours" value={form.openHours} onChange={(e) => setForm({ ...form, openHours: e.target.value })} />
          <input className="input-field" type="number" step="0.1" min={0} max={5} placeholder="Rating (0–5)" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
          <input className="input-field" type="number" min={0} placeholder="Cost for two (Rs.)" value={form.avgCostPerHead} onChange={(e) => setForm({ ...form, avgCostPerHead: Number(e.target.value) })} />
          <input className="input-field" placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
          <input className="input-field md:col-span-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button onClick={create} className="mt-4"><Plus className="w-4 h-4" /> Add Restaurant</Button>
      </TabCard>

      <TabCard title={`All restaurants (${restaurants.length})`} icon={Store}>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-primary-100 text-xs uppercase tracking-wider text-forest-400">
                <th className="text-left pb-3">Name</th>
                <th className="text-left pb-3">Cuisine</th>
                <th className="text-left pb-3">City</th>
                <th className="text-left pb-3">Rating</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-right pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r) => (
                <tr key={r.id} className="trow border-b border-primary-50 last:border-0">
                  <td className="py-3 font-semibold text-forest-800">{r.name}</td>
                  <td className="py-3 text-forest-500">{r.cuisine}</td>
                  <td className="py-3 text-forest-500">{r.city}</td>
                  <td className="py-3 text-forest-700 font-semibold">★ {r.rating ?? '—'}</td>
                  <td className="py-3">
                    <StatusBadge status={r.active ? 'READY' : 'CANCELLED'} dot={false} />
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      variant={r.active ? 'danger' : 'secondary'}
                      size="sm"
                      onClick={() => toggle(r)}
                      className="!px-3"
                    >
                      {r.active ? <><Trash2 className="w-3.5 h-3.5" /> Deactivate</> : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
              {!loading && restaurants.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-forest-400">No restaurants yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </TabCard>
    </div>
  );
}

/* ==================== MENU ==================== */

function MenuTab() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | ''>('');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [form, setForm] = useState({ name: '', category: '', price: 100, dietaryTags: '', spiceLevel: 0, prepTimeMinutes: 15, description: '' });

  useEffect(() => {
    restaurantAPI.getAll().then((res) => setRestaurants(res.data.data)).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (restaurantId === '') { setMenu([]); return; }
    restaurantAPI.getMenu(Number(restaurantId)).then((res) => setMenu(res.data.data)).catch(() => setMenu([]));
  }, [restaurantId]);

  const add = async () => {
    if (restaurantId === '' || !form.name) return;
    try {
      await restaurantAPI.addMenuItem(Number(restaurantId), form);
      toast.success('Menu item added');
      setForm({ name: '', category: '', price: 100, dietaryTags: '', spiceLevel: 0, prepTimeMinutes: 15, description: '' });
      const res = await restaurantAPI.getMenu(Number(restaurantId));
      setMenu(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const refresh = () => {
    if (restaurantId === '') return;
    restaurantAPI.getMenu(Number(restaurantId)).then((res) => setMenu(res.data.data)).catch(() => undefined);
  };

  const editPrice = async (m: MenuItem) => {
    const raw = window.prompt('New price (Rs.)', String(m.price));
    if (raw === null) return;
    const price = Number(raw);
    if (!Number.isFinite(price) || price < 0) { toast.error('Enter a valid price'); return; }
    try {
      await restaurantAPI.updateMenuItem(Number(restaurantId), m.id, {
        name: m.name, category: m.category, price,
        dietaryTags: m.dietaryTags, spiceLevel: m.spiceLevel, prepTimeMinutes: m.prepTimeMinutes,
        available: m.available, description: m.description,
      });
      toast.success('Menu item updated');
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const toggleAvailable = async (m: MenuItem) => {
    try {
      await restaurantAPI.updateMenuItem(Number(restaurantId), m.id, {
        name: m.name, category: m.category, price: m.price,
        dietaryTags: m.dietaryTags, spiceLevel: m.spiceLevel, prepTimeMinutes: m.prepTimeMinutes,
        available: !m.available, description: m.description,
      });
      toast.success(m.available ? 'Item marked unavailable' : 'Item is back on the menu');
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const removeItem = async (m: MenuItem) => {
    if (!window.confirm(`Deactivate "${m.name}"?`)) return;
    try {
      await restaurantAPI.deleteMenuItem(Number(restaurantId), m.id);
      toast.success('Menu item removed');
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-5">
      <TabCard title="Add menu item" icon={Plus}>
        <select className="select-field" value={restaurantId} onChange={(e) => setRestaurantId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">Select restaurant</option>
          {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <div className="grid md:grid-cols-3 gap-3 mt-3">
          <input className="input-field" placeholder="Item name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input-field" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="input-field" type="number" min={0} placeholder="Price (Rs.)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <input className="input-field" placeholder="Dietary tags" value={form.dietaryTags} onChange={(e) => setForm({ ...form, dietaryTags: e.target.value })} />
          <input className="input-field" type="number" min={0} max={3} placeholder="Spice level (0–3)" value={form.spiceLevel} onChange={(e) => setForm({ ...form, spiceLevel: Number(e.target.value) })} />
          <input className="input-field" type="number" min={0} placeholder="Prep time (min)" value={form.prepTimeMinutes} onChange={(e) => setForm({ ...form, prepTimeMinutes: Number(e.target.value) })} />
          <input className="input-field md:col-span-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button onClick={add} className="mt-4" disabled={restaurantId === ''}><Plus className="w-4 h-4" /> Add Menu Item</Button>
      </TabCard>

      {restaurantId !== '' && (
        <TabCard title={`Menu (${menu.length} items)`} icon={UtensilsCrossed}>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="border-b border-primary-100 text-xs uppercase tracking-wider text-forest-400">
                  <th className="text-left pb-3">Name</th>
                  <th className="text-left pb-3">Category</th>
                  <th className="text-left pb-3">Price</th>
                  <th className="text-left pb-3">Spice</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-right pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((m) => (
                  <tr key={m.id} className="trow border-b border-primary-50 last:border-0 align-middle">
                    <td className="py-3 font-semibold text-forest-800">{m.name}</td>
                    <td className="py-3 text-forest-500">{m.category}</td>
                    <td className="py-3 text-forest-700 font-semibold">{formatINR(m.price)}</td>
                    <td className="py-3 text-forest-500">{m.spiceLevel ? '🔥'.repeat(Math.min(m.spiceLevel, 3)) : '—'}</td>
                    <td className="py-3"><StatusBadge status={m.available ? 'READY' : 'CANCELLED'} dot={false} /></td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <Button variant="secondary" size="sm" onClick={() => editPrice(m)} className="mr-1.5 !px-3">Edit</Button>
                      <Button variant="secondary" size="sm" onClick={() => toggleAvailable(m)} className="mr-1.5 !px-3">
                        {m.available ? 'Hide' : 'Show'}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => removeItem(m)} className="!px-2.5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {menu.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-forest-400">No items yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </TabCard>
      )}
    </div>
  );
}

/* ==================== AREAS ==================== */

function AreasTab() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | ''>('');
  const [areas, setAreas] = useState<DiningArea[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { restaurantAPI.getAll().then((res) => setRestaurants(res.data.data)).catch(() => undefined); }, []);

  useEffect(() => {
    if (restaurantId === '') { setAreas([]); return; }
    tableAPI.getAreas(Number(restaurantId)).then((res) => setAreas(res.data.data)).catch(() => setAreas([]));
  }, [restaurantId]);

  const add = async () => {
    if (restaurantId === '' || !name.trim()) return;
    try {
      await tableAPI.createArea(Number(restaurantId), { name: name.trim(), description });
      toast.success('Area added');
      setName(''); setDescription('');
      const res = await tableAPI.getAreas(Number(restaurantId));
      setAreas(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-5">
      <TabCard title="Add dining area" icon={Plus}>
        <select className="select-field" value={restaurantId} onChange={(e) => setRestaurantId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">Select restaurant</option>
          {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <input className="input-field" placeholder="Area name (e.g. Terrace, Main Hall)" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input-field flex-1" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button onClick={add} disabled={restaurantId === ''} className="shrink-0"><Plus className="w-4 h-4" /> Add Area</Button>
        </div>
      </TabCard>

      {restaurantId !== '' && (
        <TabCard title={`Dining areas (${areas.length})`} icon={Grid3x3}>
          {areas.length === 0 ? (
            <p className="text-forest-400">No areas yet — add your first one above.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 stagger">
              {areas.map((a) => (
                <div key={a.id} className="rounded-xl border border-primary-100 bg-primary-50/50 p-4">
                  <p className="font-semibold text-forest-800 flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4 text-primary-600" /> {a.name}
                  </p>
                  {a.description && <p className="text-sm text-forest-500 mt-1">{a.description}</p>}
                </div>
              ))}
            </div>
          )}
        </TabCard>
      )}
    </div>
  );
}

/* ==================== TABLES ==================== */

function TablesTab() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | ''>('');
  const [areas, setAreas] = useState<DiningArea[]>([]);
  const [areaId, setAreaId] = useState<number | ''>('');
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [form, setForm] = useState({ tableNumber: '', capacity: 4, zone: 'Main', x: 0, y: 0, wheelchairAccessible: false, quietCorner: false });

  useEffect(() => { restaurantAPI.getAll().then((res) => setRestaurants(res.data.data)).catch(() => undefined); }, []);

  useEffect(() => {
    if (restaurantId === '') { setAreas([]); setAreaId(''); setTables([]); return; }
    setAreaId('');
    setTables([]);
    tableAPI.getAreas(Number(restaurantId)).then((res) => setAreas(res.data.data)).catch(() => setAreas([]));
  }, [restaurantId]);

  useEffect(() => {
    if (areaId === '') { setTables([]); return; }
    tableAPI.getTablesByArea(Number(areaId)).then((res) => setTables(res.data.data)).catch(() => setTables([]));
  }, [areaId]);

  const add = async () => {
    if (areaId === '' || !form.tableNumber.trim()) return;
    try {
      await tableAPI.createTable(Number(areaId), form);
      toast.success('Table added');
      setForm({ ...form, tableNumber: '' });
      const res = await tableAPI.getTablesByArea(Number(areaId));
      setTables(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-5">
      <TabCard title="Add table" icon={Plus}>
        <div className="grid md:grid-cols-2 gap-3">
          <select className="select-field" value={restaurantId} onChange={(e) => setRestaurantId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">Select restaurant</option>
            {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select className="select-field" value={areaId} onChange={(e) => setAreaId(e.target.value ? Number(e.target.value) : '')} disabled={restaurantId === ''}>
            <option value="">Select area</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <input className="input-field" placeholder="Table number (e.g. T-12)" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} />
          <input className="input-field" type="number" min={1} placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
          <input className="input-field" placeholder="Zone" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} />
          <div className="flex items-end gap-4 pb-1">
            <label className="flex items-center gap-2 text-sm font-medium text-forest-700 cursor-pointer">
              <input type="checkbox" checked={form.wheelchairAccessible} onChange={(e) => setForm({ ...form, wheelchairAccessible: e.target.checked })} className="accent-primary-600 w-4 h-4" />
              Wheelchair accessible
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-forest-700 cursor-pointer">
              <input type="checkbox" checked={form.quietCorner} onChange={(e) => setForm({ ...form, quietCorner: e.target.checked })} className="accent-primary-600 w-4 h-4" />
              Quiet corner
            </label>
          </div>
        </div>
        <Button onClick={add} className="mt-4" disabled={areaId === ''}><Plus className="w-4 h-4" /> Add Table</Button>
      </TabCard>

      {areaId !== '' && (
        <TabCard title={`Tables in area (${tables.length})`} icon={Table2}>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-primary-100 text-xs uppercase tracking-wider text-forest-400">
                  <th className="text-left pb-3">Table</th>
                  <th className="text-left pb-3">Capacity</th>
                  <th className="text-left pb-3">Zone</th>
                  <th className="text-left pb-3">Features</th>
                  <th className="text-left pb-3">Cleaning</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((t) => (
                  <tr key={t.id} className="trow border-b border-primary-50 last:border-0">
                    <td className="py-3 font-semibold text-forest-800">{t.tableNumber}</td>
                    <td className="py-3 text-forest-500 flex items-center gap-1"><Users2 className="w-3.5 h-3.5" /> {t.capacity}</td>
                    <td className="py-3 text-forest-500">{t.zone}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {t.wheelchairAccessible && <span className="forest-chip !px-2">♿</span>}
                        {t.quietCorner && <span className="gold-chip !px-2">Quiet</span>}
                      </div>
                    </td>
                    <td className="py-3"><StatusBadge status={t.cleaningStatus} /></td>
                  </tr>
                ))}
                {tables.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-forest-400">No tables yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </TabCard>
      )}
    </div>
  );
}

/* ==================== SLOTS ==================== */

function SlotsTab() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | ''>('');
  const [areas, setAreas] = useState<DiningArea[]>([]);
  const [areaId, setAreaId] = useState<number | ''>('');
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [tableId, setTableId] = useState<number | ''>('');
  const [form, setForm] = useState({ slotDate: todayISO(), startTime: '19:00', endTime: '21:00', sessionName: 'Dinner' });
  const [allSlots, setAllSlots] = useState<TableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  useEffect(() => {
    restaurantAPI.getAll().then((res) => setRestaurants(res.data.data)).catch(() => undefined);
    loadSlots();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const loadSlots = () => {
    slotAPI.getAll()
      .then((res) => setAllSlots(res.data.data))
      .catch(() => undefined)
      .finally(() => setSlotsLoading(false));
  };

  useEffect(() => {
    if (restaurantId === '') { setAreas([]); setAreaId(''); setTables([]); setTableId(''); return; }
    setAreaId(''); setTableId('');
    tableAPI.getAreas(Number(restaurantId)).then((res) => setAreas(res.data.data)).catch(() => setAreas([]));
  }, [restaurantId]);

  useEffect(() => {
    if (areaId === '') { setTables([]); setTableId(''); return; }
    setTableId('');
    tableAPI.getTablesByArea(Number(areaId)).then((res) => setTables(res.data.data)).catch(() => setTables([]));
  }, [areaId]);

  const create = async () => {
    if (tableId === '' || restaurantId === '') return;
    try {
      await slotAPI.create({ tableId: Number(tableId), restaurantId: Number(restaurantId), ...form });
      toast.success('Slot created');
      loadSlots();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const closeSlot = async (s: TableSlot) => {
    if (!window.confirm(`Close slot for Table ${s.tableNumber} on ${s.slotDate} at ${s.startTime}?`)) return;
    try {
      await slotAPI.close(s.id);
      toast.success('Slot closed');
      loadSlots();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const slotStatus = (s: TableSlot): string => {
    if (s.status === 'CLOSED') return 'CLOSED';
    if (s.status === 'AVAILABLE') return 'OPEN';
    return 'BOOKED';
  };

  return (
    <div className="space-y-5">
      <TabCard title="Create table slot" icon={Plus}>
        <div className="grid md:grid-cols-2 gap-3">
          <select className="select-field" value={restaurantId} onChange={(e) => setRestaurantId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">Select restaurant</option>
            {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select className="select-field" value={areaId} onChange={(e) => setAreaId(e.target.value ? Number(e.target.value) : '')} disabled={restaurantId === ''}>
            <option value="">Select area</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select className="select-field" value={tableId} onChange={(e) => setTableId(e.target.value ? Number(e.target.value) : '')} disabled={areaId === ''}>
            <option value="">Select table</option>
            {tables.map((t) => <option key={t.id} value={t.id}>Table {t.tableNumber} (seats {t.capacity})</option>)}
          </select>
          <div />
          <input className="input-field" type="date" min={todayISO()} value={form.slotDate} onChange={(e) => setForm({ ...form, slotDate: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <input className="input-field" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          </div>
          <select className="select-field" value={form.sessionName} onChange={(e) => setForm({ ...form, sessionName: e.target.value })}>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Brunch</option>
            <option>Special</option>
          </select>
        </div>
        <Button onClick={create} className="mt-4" disabled={tableId === ''}><Plus className="w-4 h-4" /> Create Slot</Button>
      </TabCard>

      <TabCard title={`All slots (${allSlots.length})`} icon={Clock}>
        {slotsLoading ? (
          <div className="h-40 shimmer" />
        ) : allSlots.length === 0 ? (
          <p className="text-forest-400">No slots yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-primary-100 text-xs uppercase tracking-wider text-forest-400">
                  <th className="text-left pb-3">Table</th>
                  <th className="text-left pb-3">Date</th>
                  <th className="text-left pb-3">Time</th>
                  <th className="text-left pb-3">Session</th>
                  <th className="text-left pb-3">Zone</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-right pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allSlots.map((s) => (
                  <tr key={s.id} className="trow border-b border-primary-50 last:border-0 align-middle">
                    <td className="py-3 font-semibold text-forest-800">Table {s.tableNumber}</td>
                    <td className="py-3 text-forest-500">{new Date(s.slotDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td className="py-3 text-forest-700">{s.startTime} – {s.endTime}</td>
                    <td className="py-3 text-forest-500">{s.sessionName}</td>
                    <td className="py-3 text-forest-500">{s.zone}</td>
                    <td className="py-3"><StatusBadge status={slotStatus(s)} dot={false} /></td>
                    <td className="py-3 text-right">
                      <Button variant="danger" size="sm" onClick={() => closeSlot(s)} disabled={s.status === 'CLOSED'} className="!px-3">
                        <Trash2 className="w-3.5 h-3.5" /> Close
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TabCard>
    </div>
  );
}

/* ==================== RESERVATIONS ==================== */

function ReservationsTab() {
  const { userEmail } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [query, setQuery] = useState('');

  const load = () => reservationAPI.getAll()
    .then((res) => setReservations(res.data.data))
    .catch(() => toast.error('Failed to load reservations'));
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const updateStatus = async (r: Reservation, status: string) => {
    try {
      await reservationAPI.updateStatus(r.reservationId, status, userEmail);
      toast.success(`Status set to ${status}`);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const submitPreOrder = async (r: Reservation) => {
    try {
      await reservationAPI.submitPreOrder(r.reservationId);
      toast.success('Pre-order sent to kitchen');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const setPreOrderStatus = async (r: Reservation, status: string) => {
    try {
      await reservationAPI.updatePreOrderStatus(r.preOrder!.id, status);
      toast.success(`Pre-order marked ${status}`);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const visible = query
    ? reservations.filter((r) =>
        [r.confirmationCode, r.restaurantName, r.userEmail].some((v) => v?.toLowerCase().includes(query.toLowerCase())),
      )
    : reservations;

  return (
    <div className="space-y-5">
      <TabCard title={`All reservations (${reservations.length})`} icon={CalendarDays}>
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-300" />
          <input
            className="input-field !py-2.5 pl-10"
            placeholder="Search by code, restaurant or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-primary-100 text-xs uppercase tracking-wider text-forest-400">
                <th className="text-left pb-3">Code</th>
                <th className="text-left pb-3">Restaurant</th>
                <th className="text-left pb-3">When</th>
                <th className="text-left pb-3">Party</th>
                <th className="text-left pb-3">Pre-order</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-right pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className="trow border-b border-primary-50 last:border-0 align-middle">
                  <td className="py-3 font-mono font-semibold text-primary-700">{r.confirmationCode}</td>
                  <td className="py-3 text-forest-800 font-medium">{r.restaurantName}</td>
                  <td className="py-3 text-forest-500 text-sm">{formatDateTime(r.reservationDateTime)}</td>
                  <td className="py-3 text-forest-500 flex items-center gap-1"><Users2 className="w-3.5 h-3.5" /> {r.partySize}</td>
                  <td className="py-3">
                    {r.preOrder ? <StatusBadge status={r.preOrder.status} dot={false} /> : <span className="text-xs text-forest-300">—</span>}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={r.status} dot={false} />
                    {r.billPaid && (
                      <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Bill
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    {r.status === 'CONFIRMED' && (
                      <Button variant="secondary" size="sm" onClick={() => updateStatus(r, 'SEATED')} className="mr-1.5 !px-3">Seat</Button>
                    )}
                    {r.status === 'SEATED' && (
                      <Button variant="secondary" size="sm" onClick={() => updateStatus(r, 'COMPLETED')} className="mr-1.5 !px-3">Complete</Button>
                    )}
                    {r.status === 'HOLD' && (
                      <Button variant="danger" size="sm" onClick={() => updateStatus(r, 'CANCELLED')} className="mr-1.5 !px-3">Cancel</Button>
                    )}
                    {r.preOrder?.status === 'DRAFT' && (
                      <Button variant="gold" size="sm" onClick={() => submitPreOrder(r)} className="mr-1.5 !px-3">
                        <ChefHat className="w-3.5 h-3.5" /> Kitchen
                      </Button>
                    )}
                    {r.preOrder?.status === 'PLACED' && (
                      <Button variant="secondary" size="sm" onClick={() => setPreOrderStatus(r, 'IN_PREP')} className="mr-1.5 !px-3">In Prep</Button>
                    )}
                    {r.preOrder?.status === 'IN_PREP' && (
                      <Button variant="secondary" size="sm" onClick={() => setPreOrderStatus(r, 'SERVED')} className="mr-1.5 !px-3">Served</Button>
                    )}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-forest-400">
                  {query ? 'No reservations match your search.' : 'No reservations yet.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </TabCard>
    </div>
  );
}

/* ==================== FEEDBACK ==================== */

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(value) ? 'text-gold-500 fill-gold-400' : 'text-forest-200'}`} />
      ))}
    </span>
  );
}

function FeedbackTab() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | ''>('');
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    restaurantAPI.getAll().then((res) => setRestaurants(res.data.data)).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (restaurantId === '') { setFeedback([]); return; }
    setLoading(true);
    reservationAPI.getRestaurantFeedback(Number(restaurantId))
      .then((res) => setFeedback(res.data.data))
      .catch(() => setFeedback([]))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const avg = (pick: (f: FeedbackRecord) => number) =>
    feedback.length ? feedback.reduce((sum, f) => sum + pick(f), 0) / feedback.length : 0;

  const summaryCards = [
    { label: 'Overall', value: avg((f) => f.overallRating), accent: true },
    { label: 'Food', value: avg((f) => f.foodRating) },
    { label: 'Service', value: avg((f) => f.serviceRating) },
    { label: 'Ambience', value: avg((f) => f.ambienceRating) },
  ];

  return (
    <div className="space-y-5">
      <TabCard title="Guest feedback" icon={MessageSquareHeart}>
        <select
          className="select-field max-w-md"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Select restaurant</option>
          {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        {loading ? (
          <div className="h-32 shimmer mt-4" />
        ) : restaurantId !== '' && feedback.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              {summaryCards.map(({ label, value, accent }) => (
                <div
                  key={label}
                  className={cn(
                    'rounded-xl border p-4 text-center',
                    accent ? 'bg-gold-50 border-gold-200' : 'bg-primary-50/50 border-primary-100',
                  )}
                >
                  <p className="font-display text-2xl font-bold text-forest-900">{value.toFixed(1)}</p>
                  <Stars value={value} />
                  <p className={cn('text-xs font-semibold mt-1', accent ? 'text-gold-700' : 'text-forest-500')}>{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-forest-400 mt-2">{feedback.length} review{feedback.length > 1 ? 's' : ''} · averages sync to the restaurant's live rating automatically.</p>

            <div className="space-y-3 mt-5">
              {feedback.map((f) => (
                <div key={f.id} className="rounded-xl border border-primary-100 bg-primary-50/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Stars value={f.overallRating} />
                      <span className="font-mono text-[11px] text-primary-600">{f.reservationId.slice(0, 8)}…</span>
                      <span className="text-[11px] text-forest-400">{formatDateTime(f.createdAt)}</span>
                    </div>
                    <div className="flex gap-1.5 text-[10px] font-bold uppercase tracking-wide">
                      <span className="rounded-full bg-white border border-primary-100 px-2 py-0.5 text-forest-600">Food {f.foodRating}</span>
                      <span className="rounded-full bg-white border border-primary-100 px-2 py-0.5 text-forest-600">Service {f.serviceRating}</span>
                      <span className="rounded-full bg-white border border-primary-100 px-2 py-0.5 text-forest-600">Vibe {f.ambienceRating}</span>
                    </div>
                  </div>
                  {f.comment && <p className="text-sm text-forest-700 mt-2">“{f.comment}”</p>}
                </div>
              ))}
            </div>
          </>
        ) : restaurantId !== '' ? (
          <p className="text-forest-400 py-8 text-center">No feedback yet for this restaurant — reviews appear here the moment guests scan their feedback QR.</p>
        ) : (
          <p className="text-forest-400 py-8 text-center">Select a restaurant to see guest reviews and category averages.</p>
        )}
      </TabCard>
    </div>
  );
}

/* ==================== LIVE OPS ==================== */

interface LiveReservationEvent {
  id: string;
  restaurantName: string;
  restaurantCity: string;
  reservationDateTime: string;
  partySize: number;
  status: string;
  confirmationCode: string;
}

interface LiveTableEvent {
  id: string;
  tableNumber: string;
  zone: string;
  cleaningStatus: string;
  capacity: number;
}

function LiveOpsTab() {
  const [resOnline, setResOnline] = useState(false);
  const [tablesOnline, setTablesOnline] = useState(false);
  const [resEvents, setResEvents] = useState<LiveReservationEvent[]>([]);
  const [tableEvents, setTableEvents] = useState<LiveTableEvent[]>([]);
  const [tablesSnapshot, setTablesSnapshot] = useState<Map<string, LiveTableEvent>>(new Map());

  useEffect(() => {
    const resSource = new EventSource('/api/reservations/stream');
    resSource.onopen = () => setResOnline(true);
    resSource.onerror = () => setResOnline(false);
    resSource.addEventListener('reservation', (e) => {
      try {
        const evt = JSON.parse((e as MessageEvent).data) as LiveReservationEvent;
        setResEvents((prev) => [evt, ...prev].slice(0, 8));
      } catch { /* ignore malformed */ }
    });

    const tableSource = new EventSource('/api/tables/stream');
    tableSource.onopen = () => setTablesOnline(true);
    tableSource.onerror = () => setTablesOnline(false);
    tableSource.addEventListener('table', (e) => {
      try {
        const evt = JSON.parse((e as MessageEvent).data) as LiveTableEvent;
        setTableEvents((prev) => [evt, ...prev].slice(0, 8));
        setTablesSnapshot((prev) => {
          const next = new Map(prev);
          next.set(String(evt.id), evt);
          return next;
        });
      } catch { /* ignore malformed */ }
    });

    return () => {
      resSource.close();
      tableSource.close();
    };
  }, []);

  const allTables = Array.from(tablesSnapshot.values()).sort((a, b) => a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true }));

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Reservations live board */}
        <TabCard title="Reservations live board" icon={CalendarDays}>
          <div className="flex items-center gap-2 mb-4">
            <span className={cn('w-2.5 h-2.5 rounded-full animate-pulse', resOnline ? 'bg-green-500' : 'bg-red-400')} />
            <span className="text-xs font-semibold text-forest-500">{resOnline ? 'Live · watching for changes' : 'Disconnected · retrying…'}</span>
          </div>
          {resEvents.length === 0 ? (
            <p className="text-center text-forest-400 py-10">No reservation activity yet. Create a reservation and it appears here instantly.</p>
          ) : (
            <div className="space-y-2">
              {resEvents.map((r) => (
                <div key={`${r.id}-${r.confirmationCode}`} className="rounded-xl border border-primary-100 bg-primary-50/50 p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-forest-800 text-sm truncate flex items-center gap-2">
                      <span className="font-mono text-[11px] text-primary-600">{r.confirmationCode}</span>
                    </p>
                    <p className="text-xs text-forest-500 truncate">{r.restaurantName} · {r.partySize} guests</p>
                    <p className="text-[11px] text-forest-400">{formatDateTime(r.reservationDateTime)}</p>
                  </div>
                  <StatusBadge status={r.status} dot={false} />
                </div>
              ))}
            </div>
          )}
        </TabCard>

        {/* Tables live board */}
        <TabCard title="Tables live board" icon={Table2}>
          <div className="flex items-center gap-2 mb-4">
            <span className={cn('w-2.5 h-2.5 rounded-full animate-pulse', tablesOnline ? 'bg-green-500' : 'bg-red-400')} />
            <span className="text-xs font-semibold text-forest-500">{tablesOnline ? 'Live · cleaning updates stream here' : 'Disconnected · retrying…'}</span>
          </div>
          {tableEvents.length === 0 ? (
            <p className="text-center text-forest-400 py-10">No table activity yet. Cleaning status changes appear here instantly.</p>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {allTables.map((t) => (
                  <span key={t.id} className={cn('px-2.5 py-1 rounded-lg text-[11px] font-bold border', t.cleaningStatus === 'READY' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700')}>
                    {t.tableNumber}
                  </span>
                ))}
              </div>
              {tableEvents.map((t) => (
                <div key={`${t.id}-${t.cleaningStatus}`} className="rounded-xl border border-primary-100 bg-primary-50/50 p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-forest-800 text-sm">Table {t.tableNumber} <span className="text-xs font-medium text-forest-400">· {t.zone} · seats {t.capacity}</span></p>
                    <p className="text-[11px] text-forest-400">{t.cleaningStatus === 'READY' ? 'Ready for the next guest' : `Being cleaned (${t.cleaningStatus})`}</p>
                  </div>
                  <StatusBadge status={t.cleaningStatus === 'READY' ? 'READY' : 'CLEANING'} dot={false} />
                </div>
              ))}
            </div>
          )}
        </TabCard>
      </div>

      <p className="text-center text-xs text-forest-400 flex items-center justify-center gap-1.5">
        <Radio className="w-3.5 h-3.5" /> Live boards auto-refresh over server-sent events — no page reload needed.
      </p>
    </div>
  );
}
