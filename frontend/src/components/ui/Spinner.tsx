import { Loader2 } from 'lucide-react';

export default function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}
