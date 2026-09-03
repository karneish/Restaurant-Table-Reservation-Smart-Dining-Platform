export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
}
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}
export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
export function formatDateTime(dt: string): string { return `${formatDate(dt)} at ${formatTime(dt)}`; }
export function timeAgo(dateStr: string): string {
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`;
}
export function truncate(t: string, n: number): string { return t.length <= n ? t : t.slice(0, n - 3) + '...'; }
export function getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
export function titleCase(s: string): string { return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()); }
export function clamp(v: number, mn: number, mx: number): number { return Math.min(Math.max(v, mn), mx); }
