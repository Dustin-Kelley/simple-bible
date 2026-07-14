import Constants from 'expo-constants';
import { BookOpen, Type } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { TRANSLATION_ABBREV, TRANSLATION_NAME } from '@/lib/bible';
import { TEXT_SIZE_LABEL, useSettings } from '@/lib/settings';
import { cn } from '@/lib/utils';

function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <Text
      className={`text-muted-foreground text-xs font-bold uppercase tracking-[0.06em] ${className ?? ''}`}>
      {children}
    </Text>
  );
}

function MiniIcon({ as }: { as: LucideIcon }) {
  return (
    <View className="bg-accent h-8 w-8 items-center justify-center rounded-[9px]">
      <Icon as={as} size={17} className="text-primary" strokeWidth={1.9} />
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
  isLast,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onPress?: () => void;
  isLast?: boolean;
}) {
  const content = (
    <View
      className={cn(
        'flex-row items-center gap-3.5 px-4 py-[15px]',
        !isLast && 'border-border border-b'
      )}>
      <MiniIcon as={icon} />
      <Text className="text-foreground flex-1 text-base font-medium">{label}</Text>
      <Text
        className={cn(
          'text-sm font-medium',
          onPress ? 'text-primary font-semibold' : 'text-muted-foreground'
        )}>
        {value}
      </Text>
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

export default function SettingsScreen() {
  const { textSize, cycleTextSize } = useSettings();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-6 pt-3">
        <Text className="text-foreground text-3xl font-extrabold tracking-tight">Settings</Text>

        {/* Reading */}
        <SectionLabel className="mb-2.5 mt-7">Reading</SectionLabel>
        <View className="bg-secondary overflow-hidden rounded-[20px]">
          <Row icon={Type} label="Text Size" value={TEXT_SIZE_LABEL[textSize]} onPress={cycleTextSize} />
          <Row icon={BookOpen} label="Translation" value={TRANSLATION_ABBREV} isLast />
        </View>

        {/* About */}
        <SectionLabel className="mb-2.5 mt-6">About</SectionLabel>
        <View className="bg-secondary rounded-[20px] px-4 py-[15px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-base font-medium">Version</Text>
            <Text className="text-muted-foreground text-sm font-medium">{version}</Text>
          </View>
        </View>

        <Text className="text-muted-foreground mt-7 px-2 text-center text-[13px] leading-5">
          Scripture quotations are from the {TRANSLATION_NAME} ({TRANSLATION_ABBREV}), which is in
          the public domain.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
