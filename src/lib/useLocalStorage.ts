import { useCallback, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (val: T | ((prev: T) => T)) => {
      setState(prev => {
        const next = typeof val === 'function' ? (val as (p: T) => T)(prev) : val;
        try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* quota exceeded */ }
        return next;
      });
    },
    [key],
  );

  return [state, set];
}
