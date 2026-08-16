import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card text-center py-16 relative overflow-hidden">
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-48 bg-primary-200/40 blur-3xl rounded-full" />
      <div className="relative">
        <span className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600 flex items-center justify-center">
          <Icon className="w-8 h-8" />
        </span>
        <h3 className="text-lg font-bold text-forest-900 mb-1">{title}</h3>
        {description && <p className="text-sm text-forest-400 mb-6 max-w-sm mx-auto">{description}</p>}
        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
