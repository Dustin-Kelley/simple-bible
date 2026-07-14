import { useRouter } from 'expo-router';
import { ArrowRight, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { chapterLabel, parseReference, refLabel, searchVerses } from '@/lib/bible';
import { THEME } from '@/lib/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SUGGESTIONS = ['Hope', 'Peace', 'Psalms 23', 'John 1', 'Strength', 'Love'];

export default function SearchScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const theme = THEME[scheme === 'dark' ? 'dark' : 'light'];
  const [query, setQuery] = useState('');

  const reference = useMemo(() => parseReference(query), [query]);
  const results = useMemo(() => searchVerses(query), [query]);
  const showEmptyState = query.trim().length >= 3 && !reference && results.length === 0;

  const goTo = (book: number, chapter: number) =>
    router.navigate({ pathname: '/read', params: { book: String(book), chapter: String(chapter) } });

  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-5 pb-6 pt-3">
        <Text className="text-foreground text-3xl font-extrabold tracking-tight">Search</Text>

        {/* Search field */}
        <View className="bg-secondary mt-5 flex-row items-center gap-3 rounded-2xl px-4 py-3.5">
          <Icon as={Search} size={20} className="text-muted-foreground" strokeWidth={1.9} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search verses, books, topics"
            placeholderTextColor={theme.mutedForeground}
            autoCorrect={false}
            returnKeyType="search"
            className="text-foreground flex-1 p-0 text-base"
          />
        </View>

        {/* Go to reference */}
        {reference ? (
          <Pressable
            onPress={() => goTo(reference.book, reference.chapter)}
            className="bg-accent mt-5 flex-row items-center justify-between rounded-2xl px-4 py-4">
            <Text className="text-primary text-base font-bold">
              Go to {chapterLabel(reference.book, reference.chapter)}
            </Text>
            <Icon as={ArrowRight} size={18} className="text-primary" strokeWidth={2.2} />
          </Pressable>
        ) : null}

        {/* Results */}
        {results.length > 0 ? (
          <View className="mt-5">
            {results.map((r) => (
              <Pressable
                key={refLabel(r)}
                onPress={() => goTo(r.book, r.chapter)}
                className="border-border border-b py-4">
                <Text className="text-primary text-xs font-bold">{refLabel(r)}</Text>
                <Text className="text-foreground/90 mt-1.5 text-[15px] leading-6" numberOfLines={3}>
                  {r.text}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {showEmptyState ? (
          <Text className="text-muted-foreground mt-8 text-center text-base">
            No verses found for “{query.trim()}”
          </Text>
        ) : null}

        {/* Suggestions */}
        {query.trim().length === 0 ? (
          <>
            <Text className="text-muted-foreground mb-3 mt-7 text-xs font-bold uppercase tracking-[0.06em]">
              Try searching
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
    </SafeAreaView>
  );
}
