import { BibleReader } from '@youversion/platform-react-native-expo-ui';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { requestChapter, useReaderNavigation } from '@/lib/reader-navigation';
import {
  DEFAULT_LAST_READ,
  getLastRead,
  setLastRead,
  type LastRead,
} from '@/lib/store';
import { useThemePreference } from '@/providers/theme-preference';

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseReadParams(params: {
  book?: string | string[];
  chapter?: string | string[];
  versionId?: string | string[];
}): LastRead | null {
  const book = firstParam(params.book)?.trim().toUpperCase();
  const chapter = firstParam(params.chapter)?.trim();
  if (!book || !chapter) return null;
  if (!/^[1-3]?[A-Z]{2,3}$/.test(book)) return null;
  if (!/^\d{1,3}$/.test(chapter)) return null;

  const versionRaw = firstParam(params.versionId)
    ? parseInt(String(firstParam(params.versionId)), 10)
    : NaN;
  return {
    book,
    chapter,
    versionId: Number.isFinite(versionRaw) ? versionRaw : DEFAULT_LAST_READ.versionId,
  };
}

export default function ReadScreen() {
  const params = useLocalSearchParams<{ book?: string; chapter?: string; versionId?: string }>();
  const bookParam = firstParam(params.book) ?? '';
  const chapterParam = firstParam(params.chapter) ?? '';
  const versionParam = firstParam(params.versionId) ?? '';
  const navigation = useReaderNavigation();
  const { preference } = useThemePreference();
  const [location, setLocation] = useState<LastRead | null>(null);

  useEffect(() => {
    let cancelled = false;
    getLastRead().then((last) => {
      if (cancelled) return;
      setLocation((current) => current ?? last ?? DEFAULT_LAST_READ);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Deep links still arrive as route params. Hand them to the reader through
  // the same navigation object the rest of the app uses. In-reader moves are
  // not written back to the URL, so this only runs when the link changes.
  useEffect(() => {
    const fromParams = parseReadParams({
      book: bookParam,
      chapter: chapterParam,
      versionId: versionParam,
    });
    if (!fromParams) return;
    requestChapter(navigation, fromParams);
  }, [bookParam, chapterParam, navigation, versionParam]);

  useEffect(() => {
    if (!location) return;
    void setLastRead(location);
  }, [location]);

  const applyPatch = useCallback((patch: Partial<LastRead>) => {
    setLocation((current) => {
      const base = current ?? DEFAULT_LAST_READ;
      const next = { ...base, ...patch };
      if (
        next.book === base.book &&
        next.chapter === base.chapter &&
        next.versionId === base.versionId
      ) {
        return current;
      }
      return next;
    });
  }, []);

  if (!location) {
    return <SafeAreaView edges={['top']} className="bg-background flex-1" />;
  }

  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <View className="flex-1">
        <BibleReader
          navigation={navigation}
          theme={preference}
          book={location.book}
          chapter={location.chapter}
          versionId={location.versionId}
          onBookChange={async (book) => {
            applyPatch({ book });
          }}
          onChapterChange={async (chapter) => {
            applyPatch({ chapter });
          }}
          onVersionChange={async (versionId) => {
            applyPatch({ versionId });
          }}
        />
      </View>
    </SafeAreaView>
  );
}
