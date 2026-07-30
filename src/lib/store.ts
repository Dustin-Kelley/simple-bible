import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_BOOK, DEFAULT_CHAPTER, DEFAULT_VERSION_ID } from '@/lib/youversion';

const KEYS = {
  lastRead: 'simple-bible/v2/last-read',
  savedVerses: 'simple-bible/v2/saved-verses',
} as const;

export type LastRead = {
  book: string;
  chapter: string;
  versionId: number;
};

export type SavedVerse = {
  reference: string;
  versionId: number;
  label: string;
  savedAt: number;
};

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
    (v) => !(v.reference === verse.reference && v.versionId === verse.versionId)
  );
  const next = [verse, ...withoutDupe].slice(0, 100);
  try {
    await AsyncStorage.setItem(KEYS.savedVerses, JSON.stringify(next));
  } catch {
    // non-fatal
  }
  return next;
}

export const DEFAULT_LAST_READ: LastRead = {
  book: DEFAULT_BOOK,
  chapter: DEFAULT_CHAPTER,
  versionId: DEFAULT_VERSION_ID,
};
