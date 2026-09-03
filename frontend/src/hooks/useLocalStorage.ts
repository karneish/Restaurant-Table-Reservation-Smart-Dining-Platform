import { useState, useCallback } from 'react';
export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void, () => void] {
  const [val, setVal] = useState<T>(() => { try { const i = localStorage.getItem(key); return i ? JSON.parse(i) : initial; } catch { return initial; } });
  const set = useCallback((v: T | ((p: T) => T)) => { const n = v instanceof Function ? v(val) : v; setVal(n); localStorage.setItem(key, JSON.stringify(n)); }, [key, val]);
  const remove = useCallback(() => { localStorage.removeItem(key); setVal(initial); }, [key, initial]);
  return [val, set, remove];
}
