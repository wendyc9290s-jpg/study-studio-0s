import { useContext } from 'react';
import { AppStateContext } from './AppStateContext';
import type { AppStateContextValue } from './AppStateContext';

export type { AppStateContextValue };

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
