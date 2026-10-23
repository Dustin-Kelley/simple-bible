import {
  biblePassageAnchorFromPassageId,
  useYVAuth,
  useYouVersion,
} from '@youversion/platform-react-native-expo-core';
import { VerseOfTheDay } from '@youversion/platform-react-native-expo-ui';
import type { VerseOfTheDayShareData } from '@youversion/platform-react-ui';
import { useFocusEffect, useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileAvatar } from '@/components/profile-avatar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { chapterLabel, parseLabelReference, parseReference } from '@/lib/reference';
import { focusPassage, requestChapter, useReaderNavigation } from '@/lib/reader-navigation';
import {
  DEFAULT_LAST_READ,
  getLastRead,
  getSavedVerses,
  saveVerse,
  type LastRead,
  type SavedVerse,
} from '@/lib/store';
import { fetchVerseOfTheDayPassageId } from '@/lib/verse-of-the-day';
import { DEFAULT_VERSION_ID } from '@/lib/youversion';
import { useThemePreference } from '@/providers/theme-preference';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function greeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <Text
      className={`text-muted-foreground text-xs font-bold uppercase tracking-[0.06em] ${className ?? ''}`}>
      {children}
    </Text>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useReaderNavigation();
  const { appKey, apiHost, installationId } = useYouVersion();
  const { colorScheme } = useThemePreference();
  const { isAuthenticated, userInfo } = useYVAuth();
  const [openingDaily, setOpeningDaily] = useState(false);
  const [dailyError, setDailyError] = useState(false);

  // The Verse of the Day card is deliberately inverted against the app chrome:
  // a near-black card on the light screen, a light card on the dark screen.
  const votdTheme = colorScheme === 'dark' ? 'light' : 'dark';
  const [lastRead, setLastReadState] = useState<LastRead | null>(null);
  const [saved, setSaved] = useState<SavedVerse[]>([]);

  const now = useMemo(() => new Date(), []);
  const firstName = isAuthenticated
    ? userInfo?.name?.trim().split(/\s+/)[0] || null
    : null;

  useFocusEffect(
    useCallback(() => {
      getLastRead().then(setLastReadState);
      getSavedVerses().then(setSaved);
    }, [])
  );

  const continueTarget = lastRead ?? DEFAULT_LAST_READ;
  const latestSaved = saved[0] ?? null;

  const openChapter = (target: { book: string; chapter: string; versionId?: number }) => {
    requestChapter(navigation, target);
    router.navigate('/read');
  };

  const openSaved = (item: SavedVerse) => {
    const parsed =
      parseReference(item.reference) ??
      parseLabelReference(item.label) ??
      parseLabelReference(item.reference);
    if (!parsed) return;

    focusPassage(navigation, {
      book: parsed.book,
      chapter: parsed.chapter,
      verse: parsed.verse,
      versionId: item.versionId,
      passageId: item.reference.includes('.') ? item.reference : undefined,
    });
    router.navigate('/read');
  };

  const openVerseOfTheDay = async () => {
    setDailyError(false);
    setOpeningDaily(true);
    const passageId = await fetchVerseOfTheDayPassageId({ appKey, apiHost, installationId });
    setOpeningDaily(false);
    if (!passageId) {
      setDailyError(true);
      return;
    }

    const anchor = biblePassageAnchorFromPassageId(passageId, DEFAULT_VERSION_ID);
    if (!anchor) {
      setDailyError(true);
      return;
    }

    if (anchor.verse === undefined) {
      navigation.request(anchor);
    } else {
      navigation.focusReference({ ...anchor, passageId });
    }
    router.navigate('/read');
  };

  const onShareDaily = async (data: VerseOfTheDayShareData) => {
    await Share.share({ message: data.text });

    const parsed = parseLabelReference(data.reference);
    if (!parsed) return;
    const next = await saveVerse({
      reference: parsed.verse
        ? `${parsed.book}.${parsed.chapter}.${parsed.verse}`
        : `${parsed.book}.${parsed.chapter}`,
      versionId: DEFAULT_VERSION_ID,
      label: parsed.label,
      savedAt: Date.now(),
    });
    setSaved(next);
  };

  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-6 pt-3">
        <View className="flex-row items-center gap-3">
          <View className="min-w-0 flex-1">
            <Text className="text-muted-foreground text-[13px] font-semibold">
              {`${WEEKDAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`}
            </Text>
            <Text className="text-foreground mt-1 text-3xl font-extrabold tracking-tight">
              {greeting(now.getHours())}
            </Text>
            {firstName ? (
              <Text className="text-muted-foreground mt-1 text-lg font-semibold tracking-tight">
                {firstName}
              </Text>
            ) : null}
          </View>
          <ProfileAvatar onPress={() => router.navigate('/settings')} />
        </View>

        {/* Radius matches the SDK card's own `rounded-2xl` so no DOM-body
            background bleeds through the corners once the card is inverted. */}
        <View className="mt-6 overflow-hidden rounded-2xl">
          <VerseOfTheDay
            versionId={DEFAULT_VERSION_ID}
            theme={votdTheme}
            background={votdTheme}
            size="lg"
            showShareButton
            showBibleAppAttribution
            onShare={onShareDaily}
          />
        </View>
        <Pressable
          onPress={() => {
            void openVerseOfTheDay();
          }}
          disabled={openingDaily}
          accessibilityRole="button"
          className="mt-3 items-center py-2">
          <Text className="text-primary text-sm font-semibold">
            {openingDaily ? 'Opening…' : 'Read this verse'}
          </Text>
        </Pressable>
        {dailyError ? (
          <Text className="text-muted-foreground text-center text-[13px]">
            Could not open the verse for today. Try again.
          </Text>
        ) : null}

        <SectionLabel className="mb-3 mt-7">Continue reading</SectionLabel>
        <Pressable
          onPress={() => openChapter(continueTarget)}
          className="bg-secondary dark:border-border flex-row items-center gap-4 rounded-[18px] p-[18px] dark:border">
          <View className="bg-accent h-[50px] w-[50px] items-center justify-center rounded-[14px]">
            <Icon as={BookOpen} size={24} className="text-primary" strokeWidth={1.8} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-[17px] font-bold">
              {chapterLabel(continueTarget.book, continueTarget.chapter)}
            </Text>
            <Text className="text-muted-foreground mt-0.5 text-[13px] font-medium">
              {lastRead ? 'Pick up where you left off' : 'Start reading'}
            </Text>
          </View>
        </Pressable>

        {latestSaved ? (
          <>
            <SectionLabel className="mb-3 mt-7">Recently saved</SectionLabel>
            {saved.slice(0, 5).map((item) => {
              return (
                <Pressable
                  key={`${item.reference}-${item.versionId}-${item.savedAt}`}
                  onPress={() => openSaved(item)}
                  className="bg-secondary dark:border-border mb-2.5 rounded-[18px] px-[18px] py-4 dark:border">
                  <Text className="text-primary text-xs font-semibold">{item.label}</Text>
                  <Text className="text-muted-foreground mt-1 text-[13px] font-medium">
                    Open in reader
                  </Text>
                </Pressable>
              );
            })}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
