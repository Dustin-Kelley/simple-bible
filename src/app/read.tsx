import { BibleReader } from '@youversion/platform-react-native-expo-ui';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  DEFAULT_LAST_READ,
  getLastRead,
  setLastRead,
  type LastRead,
} from '@/lib/store';

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

  const [initial, setInitial] = useState<LastRead | null>(() => parseReadParams(params));
  const [appliedParamKey, setAppliedParamKey] = useState(paramKey);
  const latestRef = useRef<LastRead>(DEFAULT_LAST_READ);

  // Adjust during render when navigation params change (React-recommended pattern).
  if (paramKey !== appliedParamKey) {
    setAppliedParamKey(paramKey);
    const fromParams = parseReadParams(params);
    if (fromParams) setInitial(fromParams);
  }

  useEffect(() => {
    if (initial) latestRef.current = initial;
  }, [initial]);

  useEffect(() => {
    let cancelled = false;
    getLastRead().then((last) => {
      if (cancelled) return;
      setInitial((current) => current ?? last ?? DEFAULT_LAST_READ);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!initial) return;
    void setLastRead(initial);
  }, [initial]);

  const persistPatch = useCallback(async (patch: Partial<LastRead>) => {
    const next = { ...latestRef.current, ...patch };
    latestRef.current = next;
    await setLastRead(next);
  }, []);

  const onBookChange = useCallback(
    async (book: string) => {
      await persistPatch({ book });
    },
    [persistPatch]
  );

  const onChapterChange = useCallback(
    async (chapter: string) => {
      await persistPatch({ chapter });
    },
    [persistPatch]
  );

  const onVersionChange = useCallback(
    async (versionId: number) => {
      await persistPatch({ versionId });
    },
    [persistPatch]
  );

  if (!initial) {
    return <SafeAreaView edges={['top']} className="bg-background flex-1" />;
  }

  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <View className="flex-1">
        <BibleReader
          key={`${initial.book}-${initial.chapter}-${initial.versionId}-${appliedParamKey}`}
          defaultBook={initial.book}
          defaultChapter={initial.chapter}
          defaultVersionId={initial.versionId}
          theme="system"
          onBookChange={onBookChange}
          onChapterChange={onChapterChange}
          onVersionChange={onVersionChange}
        />
      </View>
    </SafeAreaView>
  );
}
