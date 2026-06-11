import { Bookmark, BookOpen, Headphones, Share2 } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <Text
      className={`text-muted-foreground text-xs font-bold uppercase tracking-[0.06em] ${className ?? ''}`}>
      {children}
    </Text>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-6 pt-3">
        <Text className="text-muted-foreground text-[13px] font-semibold">Tuesday, June 11</Text>
        <Text className="text-foreground mt-1 text-3xl font-extrabold tracking-tight">
          Good morning
        </Text>

        {/* Verse of the Day */}
        <View className="bg-foreground dark:bg-card dark:border-border mt-6 rounded-3xl p-6 dark:border">
          <Text className="text-primary text-[11px] font-bold uppercase tracking-[0.14em]">
            Verse of the Day
          </Text>
          <Text className="text-background dark:text-foreground mt-3.5 text-[22px] font-semibold leading-8">
            Those who wait are given new strength; they rise on steady wings, and are not weary.
          </Text>
          <Text className="text-muted-foreground mt-4 text-[13px] font-semibold">Isaiah 40:31</Text>

          <View className="mt-5 flex-row gap-2.5">
            <Button className="h-[46px] flex-1 gap-2 rounded-[13px]">
              <Icon as={Bookmark} size={17} />
              <Text className="font-bold">Save</Text>
            </Button>
            <Pressable className="dark:bg-border h-[46px] w-[46px] items-center justify-center rounded-[13px] bg-white/10">
              <Icon as={Share2} size={18} className="text-background dark:text-foreground" />
            </Pressable>
            <Pressable className="dark:bg-border h-[46px] w-[46px] items-center justify-center rounded-[13px] bg-white/10">
              <Icon as={Headphones} size={18} className="text-background dark:text-foreground" />
            </Pressable>
          </View>
        </View>

        {/* Continue reading */}
        <SectionLabel className="mb-3 mt-7">Continue reading</SectionLabel>
        <Pressable className="bg-secondary dark:border-border flex-row items-center gap-4 rounded-[18px] p-[18px] dark:border">
          <View className="bg-accent h-[50px] w-[50px] items-center justify-center rounded-[14px]">
            <Icon as={BookOpen} size={24} className="text-primary" strokeWidth={1.8} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-[17px] font-bold">John 1</Text>
            <Text className="text-muted-foreground mt-0.5 text-[13px] font-medium">
              8 min left · 60%
            </Text>
            <View className="bg-border mt-2.5 h-[5px] overflow-hidden rounded-full">
              <View className="bg-primary h-full w-[60%] rounded-full" />
            </View>
          </View>
        </Pressable>

        {/* Recently saved */}
        <SectionLabel className="mb-3 mt-7">Recently saved</SectionLabel>
        <View className="bg-secondary dark:border-border rounded-[18px] p-[18px] dark:border">
          <Text className="text-foreground/80 text-base font-medium leading-6">
            Be still, and let the day arrive; what is held in peace is never truly lost.
          </Text>
          <Text className="text-primary mt-2.5 text-xs font-semibold">Psalm 46:10</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
