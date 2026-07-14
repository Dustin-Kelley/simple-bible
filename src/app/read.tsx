import { useLocalSearchParams } from 'expo-router';
import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import {
  BIBLE,
  bookName,
  chapterCount,
  chapterLabel,
  getChapter,
  nextChapter,
  prevChapter,
} from '@/lib/bible';
import { READER_FONT, useSettings } from '@/lib/settings';
import { getLastRead, setLastRead } from '@/lib/store';

const DEFAULT_POSITION = { book: 42, chapter: 1 }; // John 1

type Position = { book: number; chapter: number };

function VerseNumber({ children }: { children: string }) {
  return <Text className="text-primary text-xs font-bold">{children} </Text>;
}

function BookPicker({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (position: Position) => void;
}) {
  const [book, setBook] = useState<number | null>(null);

  const close = () => {
    setBook(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <View className="bg-background flex-1">
        <View className="border-border flex-row items-center justify-between border-b px-5 py-4">
          {book === null ? (
            <Text className="text-foreground text-lg font-bold">Books</Text>
          ) : (
            <Pressable onPress={() => setBook(null)} className="flex-row items-center gap-1">
              <Icon as={ChevronLeft} size={18} className="text-primary" strokeWidth={2.2} />
              <Text className="text-primary text-base font-semibold">{bookName(book)}</Text>
            </Pressable>
          )}
          <Pressable onPress={close} hitSlop={8}>
            <Icon as={X} size={20} className="text-muted-foreground" strokeWidth={2.2} />
          </Pressable>
        </View>

        {book === null ? (
          <FlatList
            data={BIBLE}
            keyExtractor={(item) => item.name}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => setBook(index)}
                className="border-border flex-row items-center justify-between border-b px-5 py-3.5">
                <Text className="text-foreground text-base font-medium">{item.name}</Text>
                <Text className="text-muted-foreground text-sm">{item.chapters.length}</Text>
              </Pressable>
            )}
          />
        ) : (
          <ScrollView contentContainerClassName="flex-row flex-wrap gap-2.5 p-5">
            {Array.from({ length: chapterCount(book) }, (_, i) => i + 1).map((chapter) => (
              <Pressable
                key={chapter}
                onPress={() => {
                  onSelect({ book, chapter });
                  close();
                }}
                className="bg-secondary h-[52px] w-[52px] items-center justify-center rounded-xl">
                <Text className="text-foreground text-base font-semibold">{chapter}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

function parsePositionParams(params: { book?: string; chapter?: string }): Position | null {
  if (params.book === undefined || params.chapter === undefined) return null;
  const book = parseInt(String(params.book), 10);
  const chapter = parseInt(String(params.chapter), 10);
  if (Number.isNaN(book) || Number.isNaN(chapter)) return null;
  if (!BIBLE[book] || chapter < 1 || chapter > chapterCount(book)) return null;
  return { book, chapter };
}

export default function ReadScreen() {
  const params = useLocalSearchParams<{ book?: string; chapter?: string }>();
  const { textSize, cycleTextSize } = useSettings();
  const paramKey = `${params.book}:${params.chapter}`;
  const [position, setPosition] = useState<Position | null>(() => parsePositionParams(params));
  const [appliedParamKey, setAppliedParamKey] = useState(paramKey);
  const [pickerOpen, setPickerOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Navigations from Home/Search pass book & chapter params (adjust during render).
  if (paramKey !== appliedParamKey) {
    setAppliedParamKey(paramKey);
    const fromParams = parsePositionParams(params);
    if (fromParams) setPosition(fromParams);
  }

  // Initial position when not navigated to directly: last-read location, or John 1.
  useEffect(() => {
    getLastRead().then((last) => {
      setPosition((current) => current ?? last ?? DEFAULT_POSITION);
    });
  }, []);

  useEffect(() => {
    if (!position) return;
    setLastRead(position);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [position]);

  if (!position) {
    return <SafeAreaView edges={['top']} className="bg-background flex-1" />;
  }

  const { book, chapter } = position;
  const verses = getChapter(book, chapter);
  const prev = prevChapter(book, chapter);
  const next = nextChapter(book, chapter);
  const font = READER_FONT[textSize];

  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      {/* Header */}
      <View className="border-border flex-row items-center justify-between border-b px-4 pb-3 pt-1">
        <Pressable
          onPress={() => setPickerOpen(true)}
          className="bg-secondary flex-row items-center gap-2 rounded-xl px-3.5 py-2.5">
          <Text className="text-foreground text-base font-bold">{chapterLabel(book, chapter)}</Text>
          <Icon as={ChevronDown} size={15} className="text-muted-foreground" strokeWidth={2.2} />
        </Pressable>
        <Pressable
          onPress={cycleTextSize}
          accessibilityLabel="Change text size"
          className="bg-secondary h-10 w-10 flex-row items-center justify-center rounded-xl">
          <Text className="text-secondary-foreground text-base font-bold">A</Text>
          <Text className="text-secondary-foreground text-xs font-bold">a</Text>
        </Pressable>
      </View>

      {/* Scripture */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-6 py-7">
        <View className="mb-6">
          <Text className="text-primary text-xs font-bold uppercase tracking-[0.1em]">
            Chapter {chapter}
          </Text>
          <Text className="text-foreground mt-1 text-[34px] font-extrabold tracking-tight">
            {bookName(book)}
          </Text>
        </View>

        <Text className="text-foreground" style={{ fontSize: font.fontSize, lineHeight: font.lineHeight }}>
          {verses.map((text, i) => (
            <Text key={i} style={{ fontSize: font.fontSize, lineHeight: font.lineHeight }}>
              <VerseNumber>{String(i + 1)}</VerseNumber>
              {text}
              {i < verses.length - 1 ? ' ' : ''}
            </Text>
          ))}
        </Text>

        {/* Chapter nav */}
        <Separator className="mt-8" />
        <View className="mb-4 mt-5 flex-row items-center justify-between">
          <Pressable onPress={() => setPosition(prev)} className="flex-row items-center gap-2 py-2">
            <Icon as={ChevronLeft} size={16} className="text-muted-foreground" strokeWidth={2.2} />
            <Text className="text-muted-foreground text-sm font-semibold">
              {chapterLabel(prev.book, prev.chapter)}
            </Text>
          </Pressable>
          <Pressable onPress={() => setPosition(next)} className="flex-row items-center gap-2 py-2">
            <Text className="text-primary text-sm font-bold">
              {chapterLabel(next.book, next.chapter)}
            </Text>
            <Icon as={ChevronRight} size={16} className="text-primary" strokeWidth={2.2} />
          </Pressable>
        </View>
      </ScrollView>

      <BookPicker visible={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={setPosition} />
    </SafeAreaView>
  );
}
