import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export default function Modal({ open, onClose, title, subtitle, icon, children, footer, wide }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-3xl bg-white shadow-card-lg animate-zoom-in my-auto`}
        role="dialog"
        aria-modal="true"
      >
        {(title || icon) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6">
            <div className="flex items-center gap-3">
              {icon && (
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center shadow-glow shrink-0">
                  {icon}
                </span>
              )}
              <div>
                {title && <h2 className="text-lg font-bold text-forest-900">{title}</h2>}
                {subtitle && <p className="text-sm text-forest-400">{subtitle}</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-forest-50 hover:bg-forest-100 text-forest-600 flex items-center justify-center transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 pb-6 pt-1">{footer}</div>}
      </div>
    </div>
  );
}
