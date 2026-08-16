import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  icon: LucideIcon;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function SectionHeading({ icon: Icon, title, eyebrow, subtitle, action }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center shadow-glow shrink-0">
          <Icon className="w-5 h-5" />
        </span>
        <div>
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600 mb-0.5">{eyebrow}</p>
          )}
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-forest-900">{title}</h2>
          {subtitle && <p className="text-forest-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
