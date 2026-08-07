import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  getThemePreference,
  setThemePreference as persistThemePreference,
  type ThemePreference,
} from '@/lib/store';

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  colorScheme: 'light' | 'dark';
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const { colorScheme: resolvedScheme, setColorScheme } = useNativeWindColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    let cancelled = false;
    getThemePreference().then((stored) => {
      if (cancelled) return;
      setPreferenceState(stored);
      setColorScheme(stored);
    });
    return () => {
      cancelled = true;
    };
  }, [setColorScheme]);

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    setColorScheme(next);
    void persistThemePreference(next);
  };

  return (
    <ThemePreferenceContext.Provider
      value={{
        preference,
        setPreference,
        colorScheme: resolvedScheme === 'dark' ? 'dark' : 'light',
      }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  const context = useContext(ThemePreferenceContext);
  if (!context) {
    throw new Error('useThemePreference must be used within ThemePreferenceProvider');
  }
  return context;
}
