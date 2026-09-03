import { useState, useEffect } from 'react';
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  useEffect(() => { const mq = window.matchMedia(query); const h = (e: MediaQueryListEvent) => setMatches(e.matches); setMatches(mq.matches); mq.addEventListener('change', h); return () => mq.removeEventListener('change', h); }, [query]);
  return matches;
}
export const useIsMobile = () => useMediaQuery('(max-width: 640px)');
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
