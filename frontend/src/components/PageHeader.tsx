import type { ReactNode } from 'react';
import { Sparkles, type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageHeader({ icon: Icon, title, eyebrow = 'TableHub', subtitle, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 text-white anim-gradient p-8 md:p-10 shadow-card-lg">
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-primary-400/25 blur-3xl anim-blob" />
      <div className="absolute -bottom-20 -left-12 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl anim-blob" style={{ animationDelay: '-7s' }} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1 space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-300" /> {eyebrow}
          </span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-[2.6rem] font-semibold leading-tight flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shadow shrink-0">
              <Icon className="w-6 h-6" />
            </span>
            <span className="anim-shimmer-text">{title}</span>
          </h1>
          {subtitle && <p className="text-primary-100/90 max-w-xl">{subtitle}</p>}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </section>
  );
}
