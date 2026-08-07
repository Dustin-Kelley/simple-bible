import { useYVAuth } from '@youversion/platform-react-native-expo-core';
import { VerseOfTheDay } from '@youversion/platform-react-native-expo-ui';
import type { VerseOfTheDayShareData } from '@youversion/platform-react-ui';
import { useFocusEffect, useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileAvatar } from '@/components/profile-avatar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { chapterLabel, parseLabelReference, parseReference } from '@/lib/reference';
import {
  DEFAULT_LAST_READ,
  getLastRead,
  getSavedVerses,
  saveVerse,
  type LastRead,
  type SavedVerse,
} from '@/lib/store';
import { DEFAULT_VERSION_ID } from '@/lib/youversion';

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

function navigateToRead(
  router: ReturnType<typeof useRouter>,
  target: { book: string; chapter: string; versionId?: number }
) {
  router.navigate({
    pathname: '/read',
    params: {
      book: target.book,
      chapter: target.chapter,
      ...(target.versionId != null ? { versionId: String(target.versionId) } : {}),
    },
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { isAuthenticated, userInfo } = useYVAuth();

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

        <SectionLabel className="mb-3 mt-7">Continue reading</SectionLabel>
        <Pressable
          onPress={() => navigateToRead(router, continueTarget)}
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
              const parsed =
                parseReference(item.reference) ??
                parseLabelReference(item.label) ??
                parseLabelReference(item.reference);
              return (
                <Pressable
                  key={`${item.reference}-${item.versionId}-${item.savedAt}`}
                  onPress={() => {
                    if (!parsed) return;
                    navigateToRead(router, {
                      book: parsed.book,
                      chapter: parsed.chapter,
                      versionId: item.versionId,
                    });
                  }}
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
