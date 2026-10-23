import {
  createBibleReaderNavigation,
  type BibleReaderNavigation,
} from '@youversion/platform-react-native-expo-ui';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { DEFAULT_VERSION_ID } from '@/lib/youversion';

const ReaderNavigationContext = createContext<BibleReaderNavigation | null>(null);

export function ReaderNavigationProvider({ children }: { children: ReactNode }) {
  const navigation = useMemo(() => createBibleReaderNavigation(), []);

  return (
    <ReaderNavigationContext.Provider value={navigation}>{children}</ReaderNavigationContext.Provider>
  );
}

export function useReaderNavigation() {
  const navigation = useContext(ReaderNavigationContext);
  if (!navigation) {
    throw new Error('useReaderNavigation must be used within ReaderNavigationProvider');
  }
  return navigation;
}

type ChapterTarget = {
  book: string;
  chapter: string;
  versionId?: number;
};

function chapterNumber(chapter: string) {
  const parsed = Number(chapter);
  if (!Number.isInteger(parsed) || parsed < 1) return null;
  return parsed;
}

/** Open a chapter in the shared reader. Does not focus a verse. */
export function requestChapter(navigation: BibleReaderNavigation, target: ChapterTarget) {
  const chapter = chapterNumber(target.chapter);
  if (chapter === null) return false;

  navigation.request({
    versionId: target.versionId ?? DEFAULT_VERSION_ID,
    bookId: target.book,
    chapter,
  });
  return true;
}

type PassageTarget = ChapterTarget & {
  verse?: string;
  passageId?: string;
};

/**
 * Open a passage in the shared reader. A verse focuses that verse inside the
 * chapter. A chapter-only target loads the whole chapter.
 */
export function focusPassage(navigation: BibleReaderNavigation, target: PassageTarget) {
  const chapter = chapterNumber(target.chapter);
  if (chapter === null) return false;

  const versionId = target.versionId ?? DEFAULT_VERSION_ID;

  if (!target.verse) {
    navigation.request({ versionId, bookId: target.book, chapter });
    return true;
  }

  const verse = Number(target.verse);
  if (!Number.isInteger(verse) || verse < 1) return false;

  navigation.focusReference({
    versionId,
    bookId: target.book,
    chapter,
    verse,
    passageId: target.passageId,
  });
  return true;
}
