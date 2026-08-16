import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  suffix?: string;
  accent?: 'primary' | 'gold';
  delay?: number;
}

export default function StatCard({ icon: Icon, label, value, suffix, accent = 'primary', delay = 0 }: StatCardProps) {
  return (
    <div
      className={`card card-hover p-5 flex items-center gap-4 animate-fade-up ${delay ? `delay-${Math.min(delay, 6)}` : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-glow ${
          accent === 'gold'
            ? 'bg-gradient-to-br from-gold-500 to-gold-600'
            : 'bg-gradient-to-br from-primary-600 to-primary-800'
        }`}
      >
        <Icon className="w-6 h-6" />
      </span>
      <div>
        <p className="text-2xl font-bold text-forest-900 leading-none">
          {value}
          {suffix && <span className="text-primary-600">{suffix}</span>}
        </p>
        <p className="text-sm text-forest-400 mt-1 font-medium">{label}</p>
      </div>
    </div>
  );
}
