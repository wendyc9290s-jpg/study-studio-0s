import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppState, Course, KeyTopic, Resource } from '../types';
import { seed } from '../data/seed';
import { loadState, saveState } from '../lib/storage';

interface AppStateContextValue {
  state: AppState;
  updateCourse: (id: string, patch: Partial<Course>) => void;
  addKeyTopic: (courseId: string) => void;
  updateKeyTopic: (courseId: string, topicId: string, patch: Partial<KeyTopic>) => void;
  deleteKeyTopic: (courseId: string, topicId: string) => void;
  addResource: (courseId: string, resource: Omit<Resource, 'id' | 'addedAt'>) => void;
  deleteResource: (courseId: string, resourceId: string) => void;
  replaceState: (next: AppState) => void;
  resetToSeed: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadState();
    if (saved) return saved;
    saveState(seed);
    return structuredClone(seed);
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveState(state), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state]);

  const updateCourse = useCallback((id: string, patch: Partial<Course>) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.map(c => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const addKeyTopic = useCallback((courseId: string) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        const id = `${courseId}-t${Date.now()}`;
        return { ...c, keyTopics: [...c.keyTopics, { id, text: 'New topic', done: false }] };
      }),
    }));
  }, []);

  const updateKeyTopic = useCallback(
    (courseId: string, topicId: string, patch: Partial<KeyTopic>) => {
      setState(prev => ({
        ...prev,
        courses: prev.courses.map(c => {
          if (c.id !== courseId) return c;
          return {
            ...c,
            keyTopics: c.keyTopics.map(t => (t.id === topicId ? { ...t, ...patch } : t)),
          };
        }),
      }));
    },
    [],
  );

  const deleteKeyTopic = useCallback((courseId: string, topicId: string) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        return { ...c, keyTopics: c.keyTopics.filter(t => t.id !== topicId) };
      }),
    }));
  }, []);

  const addResource = useCallback(
    (courseId: string, resource: Omit<Resource, 'id' | 'addedAt'>) => {
      setState(prev => ({
        ...prev,
        courses: prev.courses.map(c => {
          if (c.id !== courseId) return c;
          const newResource: Resource = {
            ...resource,
            id: crypto.randomUUID(),
            addedAt: new Date().toISOString(),
          };
          return { ...c, resources: [...c.resources, newResource] };
        }),
      }));
    },
    [],
  );

  const deleteResource = useCallback((courseId: string, resourceId: string) => {
    setState(prev => ({
      ...prev,
      courses: prev.courses.map(c => {
        if (c.id !== courseId) return c;
        return { ...c, resources: c.resources.filter(r => r.id !== resourceId) };
      }),
    }));
  }, []);

  const replaceState = useCallback((next: AppState) => {
    setState(next);
  }, []);

  const resetToSeed = useCallback(() => {
    setState(structuredClone(seed));
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        state,
        updateCourse,
        addKeyTopic,
        updateKeyTopic,
        deleteKeyTopic,
        addResource,
        deleteResource,
        replaceState,
        resetToSeed,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
