import { ChevronDown, ChevronLeft, ChevronRight, Headphones } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

function VerseNumber({ children }: { children: string }) {
  return <Text className="text-primary text-xs font-bold">{children} </Text>;
}

export default function ReadScreen() {
  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      {/* Header */}
      <View className="border-border flex-row items-center justify-between border-b px-4 pb-3 pt-1">
        <Pressable className="bg-secondary flex-row items-center gap-2 rounded-xl px-3.5 py-2.5">
          <Text className="text-foreground text-base font-bold">John 1</Text>
          <Icon as={ChevronDown} size={15} className="text-muted-foreground" strokeWidth={2.2} />
        </Pressable>
        <View className="flex-row gap-2.5">
          <Pressable className="bg-secondary h-10 w-10 flex-row items-center justify-center rounded-xl">
            <Text className="text-secondary-foreground text-base font-bold">A</Text>
            <Text className="text-secondary-foreground text-xs font-bold">a</Text>
          </Pressable>
          <Pressable className="bg-secondary h-10 w-10 items-center justify-center rounded-xl">
            <Icon as={Headphones} size={18} className="text-secondary-foreground" strokeWidth={1.9} />
          </Pressable>
        </View>
      </View>

      {/* Scripture */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-6 py-7">
        <View className="mb-6">
          <Text className="text-primary text-xs font-bold uppercase tracking-[0.1em]">
            Chapter 1
          </Text>
          <Text className="text-foreground mt-1 text-[34px] font-extrabold tracking-tight">
            John
          </Text>
        </View>

        <Text className="text-foreground" style={{ fontSize: 19, lineHeight: 33 }}>
          <VerseNumber>1</VerseNumber>
          In the beginning the morning was quiet, and the light came gently over the still water.{' '}
          <VerseNumber>2</VerseNumber>
          And the one who waited was not afraid, for steadiness had been promised to the patient
          heart. <VerseNumber>3</VerseNumber>
          Look toward the hills, and you will find that the dawn keeps its own unhurried time.{' '}
          <Text className="bg-accent text-foreground">
            <VerseNumber>4</VerseNumber>
            Be still, and let the day arrive; what is held in peace is never truly lost.
          </Text>{' '}
          <VerseNumber>5</VerseNumber>
          For every season turns, and the long night softens into an ordinary, merciful light.{' '}
          <VerseNumber>6</VerseNumber>
          So walk slowly, and carry little, and let the road be kind beneath your feet.
        </Text>

        {/* Chapter nav */}
        <Separator className="mt-8" />
        <View className="mt-5 flex-row items-center justify-between">
          <Pressable className="flex-row items-center gap-2">
            <Icon as={ChevronLeft} size={16} className="text-muted-foreground" strokeWidth={2.2} />
            <Text className="text-muted-foreground text-sm font-semibold">Luke 24</Text>
          </Pressable>
          <Pressable className="flex-row items-center gap-2">
            <Text className="text-primary text-sm font-bold">John 2</Text>
            <Icon as={ChevronRight} size={16} className="text-primary" strokeWidth={2.2} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
