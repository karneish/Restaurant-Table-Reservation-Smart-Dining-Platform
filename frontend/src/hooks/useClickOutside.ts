import { useEffect, RefObject } from 'react';
export function useClickOutside<T extends HTMLElement>(ref: RefObject<T>, handler: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const listener = (e: MouseEvent | TouchEvent) => { if (!ref.current || ref.current.contains(e.target as Node)) return; handler(); };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => { document.removeEventListener('mousedown', listener); document.removeEventListener('touchstart', listener); };
  }, [ref, handler, enabled]);
}
