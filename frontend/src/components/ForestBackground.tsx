import { useMemo } from 'react';

const LEAF_COLORS = ['#3d8455', '#5ea884', '#90c7aa', '#3d8b66', '#7ab583', '#245a43'];

interface LeafSpec {
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  sway: number;
}

interface FireflySpec {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

export default function ForestBackground() {
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const leaves = useMemo<LeafSpec[]>(() => {
    if (reduceMotion) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      left: (i * 8.4 + 3) % 100,
      size: 8 + ((i * 17) % 11),
      duration: 12 + ((i * 23) % 14),
      delay: -((i * 4.1) % 18),
      color: LEAF_COLORS[i % LEAF_COLORS.length],
      sway: (i % 2 === 0 ? 1 : -1),
    }));
  }, [reduceMotion]);

  const fireflies = useMemo<FireflySpec[]>(() => {
    if (reduceMotion) return [];
    return Array.from({ length: 7 }, (_, i) => ({
      left: 4 + ((i * 13.7) % 90),
      top: 12 + ((i * 19.3) % 68),
      size: 3 + (i % 3),
      duration: 7 + ((i * 5) % 8),
      delay: -((i * 3.3) % 9),
    }));
  }, [reduceMotion]);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* soft drifting blobs */}
      <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary-300/20 blur-3xl anim-blob" />
      <div className="absolute top-1/3 -right-32 w-[26rem] h-[26rem] rounded-full bg-gold-200/25 blur-3xl anim-blob" style={{ animationDelay: '-8s' }} />
      <div className="absolute -bottom-24 left-1/4 w-[30rem] h-[30rem] rounded-full bg-primary-200/30 blur-3xl anim-blob" style={{ animationDelay: '-15s' }} />

      {!reduceMotion && (
        <>
          {leaves.map((leaf, i) => (
            <div
              key={`leaf-${i}`}
              className="absolute top-0 anim-leaf"
              style={{
                left: `${leaf.left}%`,
                width: leaf.size,
                height: leaf.size * 1.5,
                background: `linear-gradient(135deg, ${leaf.color}, #1a3a2b)`,
                borderRadius: '0 100% 0 100%',
                animationDuration: `${leaf.duration}s`,
                animationDelay: `${leaf.delay}s`,
                transform: `scaleX(${leaf.sway})`,
                opacity: 0.85,
              }}
            />
          ))}
          {fireflies.map((f, i) => (
            <div
              key={`firefly-${i}`}
              className="absolute rounded-full bg-gold-200 anim-firefly"
              style={{
                left: `${f.left}%`,
                top: `${f.top}%`,
                width: f.size,
                height: f.size,
                animationDuration: `${f.duration}s`,
                animationDelay: `${f.delay}s`,
                boxShadow: '0 0 10px 2px rgba(236, 211, 137, 0.8)',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
