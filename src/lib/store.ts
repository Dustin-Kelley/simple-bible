import AsyncStorage from '@react-native-async-storage/async-storage';

import type { VerseRef } from '@/lib/bible';

const KEYS = {
  lastRead: 'simple-bible/last-read',
  savedVerses: 'simple-bible/saved-verses',
  textSize: 'simple-bible/text-size',
} as const;

export type LastRead = { book: number; chapter: number };

export type SavedVerse = VerseRef & { text: string; savedAt: number };

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function getLastRead(): Promise<LastRead | null> {
  return readJson<LastRead>(KEYS.lastRead);
}

export async function setLastRead(value: LastRead) {
  try {
    await AsyncStorage.setItem(KEYS.lastRead, JSON.stringify(value));
  } catch {
    // non-fatal; reading position just won't persist
  }
}

export async function getSavedVerses(): Promise<SavedVerse[]> {
  return (await readJson<SavedVerse[]>(KEYS.savedVerses)) ?? [];
}

export async function saveVerse(verse: SavedVerse): Promise<SavedVerse[]> {
  const existing = await getSavedVerses();
  const withoutDupe = existing.filter(
    (v) => !(v.book === verse.book && v.chapter === verse.chapter && v.verse === verse.verse)
  );
  const next = [verse, ...withoutDupe].slice(0, 100);
  try {
    await AsyncStorage.setItem(KEYS.savedVerses, JSON.stringify(next));
  } catch {
    // non-fatal
  }
  return next;
}

export type TextSize = 'small' | 'default' | 'large';

export async function getTextSize(): Promise<TextSize> {
  const value = await readJson<TextSize>(KEYS.textSize);
  return value === 'small' || value === 'large' ? value : 'default';
}

export async function setTextSize(value: TextSize) {
  try {
    await AsyncStorage.setItem(KEYS.textSize, JSON.stringify(value));
  } catch {
    // non-fatal
  }
}
