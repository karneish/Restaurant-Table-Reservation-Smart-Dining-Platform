import { ReactNode } from 'react';

export const statusColors: Record<string, string> = {
  HOLD: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-sky-50 text-sky-700 border-sky-200',
  SEATED: 'bg-purple-50 text-purple-700 border-purple-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
  READY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CLEANING: 'bg-amber-50 text-amber-700 border-amber-200',
  AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  BOOKED: 'bg-sky-50 text-sky-700 border-sky-200',
  OPEN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CLOSED: 'bg-red-50 text-red-600 border-red-200',
  DRAFT: 'bg-gray-100 text-gray-600 border-gray-200',
  PLACED: 'bg-sky-50 text-sky-700 border-sky-200',
  IN_PREP: 'bg-amber-50 text-amber-700 border-amber-200',
  SERVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function StatusBadge({
  status,
  dot = true,
}: {
  status: string;
  dot?: boolean;
}) {
  const cls = statusColors[status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`pill border ${cls}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${cls.split(' ')[1]}`} />}
      {status.replace(/_/g, ' ')}
    </span>
  );
}
