import { BookOpen, Sparkles } from 'lucide-react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="flex-1 items-center justify-center gap-8 px-6">
        <View className="bg-primary/10 h-24 w-24 items-center justify-center rounded-full">
          <Icon as={BookOpen} size={44} className="text-primary" />
        </View>

        <View className="items-center gap-3">
          <Text variant="h1">Welcome to Simple Bible</Text>
          <Text variant="muted" className="max-w-xs text-center">
            Read, reflect, and grow in the Word — one verse at a time.
          </Text>
        </View>

        <Button size="lg" className="mt-2 w-full max-w-xs">
          <Icon as={Sparkles} />
          <Text>Start Reading</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
