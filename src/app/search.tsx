import { BibleChapterPickerSheet } from '@youversion/platform-react-native-expo-ui';
import { useRouter } from 'expo-router';
import { ArrowRight, BookOpen, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { parseReference } from '@/lib/reference';
import { DEFAULT_LAST_READ, getLastRead } from '@/lib/store';
import { THEME } from '@/lib/theme';
import { DEFAULT_VERSION_ID } from '@/lib/youversion';

const SUGGESTIONS = ['John 3:16', 'Psalms 23', 'Genesis 1', 'Romans 8', 'JHN.1.1', 'Matthew 5'];

export default function FindScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = THEME[scheme === 'dark' ? 'dark' : 'light'];
  const [query, setQuery] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSeed, setPickerSeed] = useState(DEFAULT_LAST_READ);

  const reference = useMemo(() => parseReference(query), [query]);

  const goTo = (book: string, chapter: string, versionId = DEFAULT_VERSION_ID) => {
    router.navigate({
      pathname: '/read',
      params: { book, chapter, versionId: String(versionId) },
    });
  };

  const openPicker = async () => {
    const last = (await getLastRead()) ?? DEFAULT_LAST_READ;
    setPickerSeed(last);
    setPickerOpen(true);
  };

  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-5 pb-6 pt-3">
        <Text className="text-foreground text-3xl font-extrabold tracking-tight">Find</Text>
        <Text className="text-muted-foreground mt-2 text-[15px] leading-5">
          Jump to a chapter by reference, or browse books and chapters.
        </Text>

        <View className="bg-secondary mt-5 flex-row items-center gap-3 rounded-2xl px-4 py-3.5">
          <Icon as={Search} size={20} className="text-muted-foreground" strokeWidth={1.9} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="John 3:16 or JHN.3.16"
            placeholderTextColor={theme.mutedForeground}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="go"
            onSubmitEditing={() => {
              if (reference) goTo(reference.book, reference.chapter);
            }}
            className="text-foreground flex-1 p-0 text-base"
          />
        </View>

        {reference ? (
          <Pressable
            onPress={() => goTo(reference.book, reference.chapter)}
            className="bg-accent mt-5 flex-row items-center justify-between rounded-2xl px-4 py-4">
            <Text className="text-primary text-base font-bold">Go to {reference.label}</Text>
            <Icon as={ArrowRight} size={18} className="text-primary" strokeWidth={2.2} />
          </Pressable>
        ) : null}

        {query.trim().length > 0 && !reference ? (
          <Text className="text-muted-foreground mt-6 text-center text-base">
            Try a reference like “John 3:16” or “Psalms 23”
          </Text>
        ) : null}

        <Pressable
          onPress={openPicker}
          className="bg-secondary dark:border-border mt-5 flex-row items-center gap-4 rounded-[18px] p-[18px] dark:border">
          <View className="bg-accent h-[50px] w-[50px] items-center justify-center rounded-[14px]">
            <Icon as={BookOpen} size={24} className="text-primary" strokeWidth={1.8} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-[17px] font-bold">Browse books</Text>
            <Text className="text-muted-foreground mt-0.5 text-[13px] font-medium">
              Open the chapter picker
            </Text>
          </View>
        </Pressable>

        {query.trim().length === 0 ? (
          <>
            <Text className="text-muted-foreground mb-3 mt-7 text-xs font-bold uppercase tracking-[0.06em]">
              Try a reference
            </Text>
            <View className="flex-row flex-wrap gap-2.5">
              {SUGGESTIONS.map((term) => (
                <Pressable
                  key={term}
                  onPress={() => setQuery(term)}
                  className="bg-accent rounded-full px-4 py-2">
                  <Text className="text-primary text-sm font-semibold">{term}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>

      <BibleChapterPickerSheet
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        book={pickerSeed.book}
        chapter={pickerSeed.chapter}
        versionId={pickerSeed.versionId}
        theme="system"
        onSelect={(data) => {
          setPickerOpen(false);
          goTo(data.book, data.chapter, data.versionId);
        }}
      />
    </SafeAreaView>
  );
}
