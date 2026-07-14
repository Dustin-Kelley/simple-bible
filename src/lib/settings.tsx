import { createContext, useContext, useEffect, useState } from 'react';

import { getTextSize, setTextSize as persistTextSize, type TextSize } from '@/lib/store';

const TEXT_SIZE_ORDER: TextSize[] = ['small', 'default', 'large'];

export const READER_FONT: Record<TextSize, { fontSize: number; lineHeight: number }> = {
  small: { fontSize: 16, lineHeight: 28 },
  default: { fontSize: 19, lineHeight: 33 },
  large: { fontSize: 23, lineHeight: 39 },
};

export const TEXT_SIZE_LABEL: Record<TextSize, string> = {
  small: 'Small',
  default: 'Default',
  large: 'Large',
};

type SettingsContextValue = {
  textSize: TextSize;
  cycleTextSize: () => void;
};

const SettingsContext = createContext<SettingsContextValue>({
  textSize: 'default',
  cycleTextSize: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSize] = useState<TextSize>('default');

  useEffect(() => {
    getTextSize().then(setTextSize);
  }, []);

  const cycleTextSize = () => {
    setTextSize((current) => {
      const next = TEXT_SIZE_ORDER[(TEXT_SIZE_ORDER.indexOf(current) + 1) % TEXT_SIZE_ORDER.length];
      persistTextSize(next);
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ textSize, cycleTextSize }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
