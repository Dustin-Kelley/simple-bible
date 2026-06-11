import { Search } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export default function SearchScreen() {
  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-6 pt-3">
        <Text className="text-foreground text-3xl font-extrabold tracking-tight">Search</Text>

        {/* Search field (mock) */}
        <View className="bg-secondary mt-5 flex-row items-center gap-3 rounded-2xl px-4 py-3.5">
          <Icon as={Search} size={20} className="text-muted-foreground" strokeWidth={1.9} />
          <Text className="text-muted-foreground text-base">Search verses, books, topics</Text>
        </View>

        {/* Suggestions */}
        <Text className="text-muted-foreground mb-3 mt-7 text-xs font-bold uppercase tracking-[0.06em]">
          Try searching
        </Text>
        <View className="flex-row flex-wrap gap-2.5">
          {['Hope', 'Peace', 'Psalm 23', 'John 1', 'Strength', 'Love'].map((term) => (
            <View key={term} className="bg-accent rounded-full px-4 py-2">
              <Text className="text-primary text-sm font-semibold">{term}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
