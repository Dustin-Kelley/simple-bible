import { useFocusEffect, useRouter } from 'expo-router';
import { Bookmark, BookmarkCheck, BookOpen, Share2 } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { chapterLabel, refLabel, TRANSLATION_ABBREV, verseOfTheDay } from '@/lib/bible';
import { getLastRead, getSavedVerses, saveVerse, type LastRead, type SavedVerse } from '@/lib/store';

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
  const [lastRead, setLastReadState] = useState<LastRead | null>(null);
  const [latestSaved, setLatestSaved] = useState<SavedVerse | null>(null);

  const now = useMemo(() => new Date(), []);
  const daily = useMemo(() => verseOfTheDay(now), [now]);
  const dailyIsSaved =
    latestSaved !== null &&
    latestSaved.book === daily.book &&
    latestSaved.chapter === daily.chapter &&
    latestSaved.verse === daily.verse;

  useFocusEffect(
    useCallback(() => {
      getLastRead().then(setLastReadState);
      getSavedVerses().then((saved) => setLatestSaved(saved[0] ?? null));
    }, [])
  );

  const continueTarget = lastRead ?? { book: 42, chapter: 1 }; // John 1

  const onSaveDaily = async () => {
    const saved = await saveVerse({ ...daily, savedAt: now.getTime() });
    setLatestSaved(saved[0] ?? null);
  };

  const onShareDaily = () => {
    Share.share({
      message: `"${daily.text}" — ${refLabel(daily)} (${TRANSLATION_ABBREV})`,
    });
  };

  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-6 pt-3">
        <Text className="text-muted-foreground text-[13px] font-semibold">
          {`${WEEKDAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`}
        </Text>
        <Text className="text-foreground mt-1 text-3xl font-extrabold tracking-tight">
          {greeting(now.getHours())}
        </Text>

        {/* Verse of the Day */}
        <View className="bg-foreground dark:bg-card dark:border-border mt-6 rounded-3xl p-6 dark:border">
          <Text className="text-primary text-[11px] font-bold uppercase tracking-[0.14em]">
            Verse of the Day
          </Text>
          <Text className="text-background dark:text-foreground mt-3.5 text-[22px] font-semibold leading-8">
            {daily.text}
          </Text>
          <Text className="text-muted-foreground mt-4 text-[13px] font-semibold">
            {refLabel(daily)}
          </Text>

          <View className="mt-5 flex-row gap-2.5">
            <Button onPress={onSaveDaily} className="h-[46px] flex-1 gap-2 rounded-[13px]">
              <Icon as={dailyIsSaved ? BookmarkCheck : Bookmark} size={17} />
              <Text className="font-bold">{dailyIsSaved ? 'Saved' : 'Save'}</Text>
            </Button>
            <Pressable
              onPress={onShareDaily}
              accessibilityLabel="Share verse"
              className="dark:bg-border h-[46px] w-[46px] items-center justify-center rounded-[13px] bg-white/10">
              <Icon as={Share2} size={18} className="text-background dark:text-foreground" />
            </Pressable>
          </View>
        </View>

        {/* Continue reading */}
        <SectionLabel className="mb-3 mt-7">Continue reading</SectionLabel>
        <Pressable
          onPress={() =>
            router.navigate({
              pathname: '/read',
              params: { book: String(continueTarget.book), chapter: String(continueTarget.chapter) },
            })
          }
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

        {/* Recently saved */}
        {latestSaved ? (
          <>
            <SectionLabel className="mb-3 mt-7">Recently saved</SectionLabel>
            <Pressable
              onPress={() =>
                router.navigate({
                  pathname: '/read',
                  params: { book: String(latestSaved.book), chapter: String(latestSaved.chapter) },
                })
              }
              className="bg-secondary dark:border-border rounded-[18px] p-[18px] dark:border">
              <Text className="text-foreground/80 text-base font-medium leading-6">
                {latestSaved.text}
              </Text>
              <Text className="text-primary mt-2.5 text-xs font-semibold">
                {refLabel(latestSaved)}
              </Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
