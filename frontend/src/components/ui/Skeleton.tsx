interface SkeletonProps {
  className?: string;
  count?: number;
  col?: boolean;
}

export default function Skeleton({ className = '', count = 1, col = false }: SkeletonProps) {
  return (
    <div className={col ? `grid gap-4 ${className}` : `${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`shimmer rounded-2xl ${col ? '' : 'w-full'}`} style={{ minHeight: i === 0 && count > 1 ? undefined : 120 }} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass rounded-2xl overflow-hidden ${className}`}>
      <div className="h-44 shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 shimmer rounded-lg" />
        <div className="h-4 w-1/2 shimmer rounded-lg" />
        <div className="h-4 w-2/3 shimmer rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonRow({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card !py-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl shimmer shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 shimmer rounded-lg" />
            <div className="h-3 w-1/2 shimmer rounded-lg" />
          </div>
          <div className="h-4 w-16 shimmer rounded-lg" />
        </div>
      ))}
    </div>
  );
}
