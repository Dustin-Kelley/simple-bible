import type { BibleChapterPickerSelectData } from '@youversion/platform-react-ui';
import {
  BibleChapterPickerSheet,
  BibleReader,
  BibleReaderSettingsSheet,
  BibleVersionPickerSheet,
} from '@youversion/platform-react-native-expo-ui';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReaderHeader } from '@/components/reader-header';
import { THEME } from '@/lib/theme';
import {
  DEFAULT_LAST_READ,
  getLastRead,
  setLastRead,
  type LastRead,
} from '@/lib/store';
import { useThemePreference } from '@/providers/theme-preference';

function parseReadParams(params: {
  book?: string;
  chapter?: string;
  versionId?: string;
}): LastRead | null {
  const book = params.book?.trim().toUpperCase();
  const chapter = params.chapter?.trim();
  if (!book || !chapter) return null;
  if (!/^[1-3]?[A-Z]{2,3}$/.test(book)) return null;
  if (!/^\d{1,3}$/.test(chapter)) return null;

  const versionRaw = params.versionId ? parseInt(String(params.versionId), 10) : NaN;
  return {
    book,
    chapter,
    versionId: Number.isFinite(versionRaw) ? versionRaw : DEFAULT_LAST_READ.versionId,
  };
}

export default function ReadScreen() {
  const params = useLocalSearchParams<{ book?: string; chapter?: string; versionId?: string }>();
  const paramKey = `${params.book ?? ''}:${params.chapter ?? ''}:${params.versionId ?? ''}`;
  const { colorScheme } = useThemePreference();

  // `location` drives the reader: book/chapter/versionId are passed as controlled
  // props, so our own header (and the picker sheets it opens) can navigate it.
  const [location, setLocation] = useState<LastRead | null>(() => parseReadParams(params));
  const [appliedParamKey, setAppliedParamKey] = useState(paramKey);
  const latestRef = useRef<LastRead>(DEFAULT_LAST_READ);

  const [isChapterPickerOpen, setChapterPickerOpen] = useState(false);
  const [isVersionPickerOpen, setVersionPickerOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  // Adjust during render when navigation params change (React-recommended pattern).
  if (paramKey !== appliedParamKey) {
    setAppliedParamKey(paramKey);
    const fromParams = parseReadParams(params);
    if (fromParams) setLocation(fromParams);
  }

  useEffect(() => {
    if (location) latestRef.current = location;
  }, [location]);

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

  useEffect(() => {
    if (!location) return;
    void setLastRead(location);
  }, [location]);

  const applyPatch = useCallback((patch: Partial<LastRead>) => {
    setLocation((current) => {
      const base = current ?? latestRef.current;
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

  // The reader still reports its own navigation (verse links, footnote jumps),
  // so mirror those back into state rather than fighting the controlled props.
  const onBookChange = useCallback(
    async (book: string) => {
      applyPatch({ book });
    },
    [applyPatch]
  );

  const onChapterChange = useCallback(
    async (chapter: string) => {
      applyPatch({ chapter });
    },
    [applyPatch]
  );

  const onVersionChange = useCallback(
    async (versionId: number) => {
      applyPatch({ versionId });
    },
    [applyPatch]
  );

  const onChapterSelect = useCallback(
    (data: BibleChapterPickerSelectData) => {
      applyPatch({ book: data.book, chapter: data.chapter, versionId: data.versionId });
    },
    [applyPatch]
  );

  const onVersionSelect = useCallback(
    (versionId: number) => {
      applyPatch({ versionId });
    },
    [applyPatch]
  );

  if (!location) {
    return <SafeAreaView edges={['top']} className="bg-background flex-1" />;
  }

  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ReaderHeader
        book={location.book}
        chapter={location.chapter}
        versionId={location.versionId}
        onPressChapter={() => setChapterPickerOpen(true)}
        onPressVersion={() => setVersionPickerOpen(true)}
        onPressSettings={() => setSettingsOpen(true)}
      />
      <View className="flex-1">
        <BibleReader
          book={location.book}
          chapter={location.chapter}
          versionId={location.versionId}
          theme="system"
          showToolbar={false}
          // Paint the WebView's scripture pane in our own theme colors so there is
          // no seam between the native header and the reader body.
          backgroundColor={THEME[colorScheme].background}
          foregroundColor={THEME[colorScheme].foreground}
          onBookChange={onBookChange}
          onChapterChange={onChapterChange}
          onVersionChange={onVersionChange}
        />
      </View>

      {/* `showToolbar={false}` also disables the SDK's internal sheets, so they are
          mounted here and driven by the header instead. */}
      <BibleChapterPickerSheet
        isOpen={isChapterPickerOpen}
        onClose={() => setChapterPickerOpen(false)}
        book={location.book}
        chapter={location.chapter}
        versionId={location.versionId}
        theme="system"
        onSelect={onChapterSelect}
      />
      <BibleVersionPickerSheet
        isOpen={isVersionPickerOpen}
        onClose={() => setVersionPickerOpen(false)}
        versionId={location.versionId}
        theme="system"
        onSelect={onVersionSelect}
      />
      <BibleReaderSettingsSheet
        isSettingsSheetOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </SafeAreaView>
  );
}
