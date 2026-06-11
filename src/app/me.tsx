import { Bell, ChevronRight, Download, Sun } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-accent h-8 w-8 items-center justify-center rounded-[9px]">{children}</View>
  );
}

function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <Text
      className={`text-muted-foreground text-xs font-bold uppercase tracking-[0.06em] ${className ?? ''}`}>
      {children}
    </Text>
  );
}

function Row({
  tile,
  label,
  value,
  right,
  isLast,
}: {
  tile: React.ReactNode;
  label: string;
  value?: string;
  right?: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-3.5 px-4 py-[15px]',
        !isLast && 'border-border border-b'
      )}>
      {tile}
      <Text className="text-foreground flex-1 text-base font-medium">{label}</Text>
      {value ? <Text className="text-muted-foreground text-sm font-medium">{value}</Text> : null}
      {right ?? (
        <Icon as={ChevronRight} size={18} className="text-muted-foreground/60" strokeWidth={2.2} />
      )}
    </View>
  );
}

function LetterTile({ small, large }: { small?: string; large: string }) {
  return (
    <IconTile>
      <View className="flex-row items-end">
        {small ? <Text className="text-primary text-[11px] font-bold">{small}</Text> : null}
        <Text className="text-primary text-base font-bold">{large}</Text>
      </View>
    </IconTile>
  );
}

function ReminderToggle() {
  const [on, setOn] = useState(true);
  return (
    <Pressable
      onPress={() => setOn((v) => !v)}
      className={cn('h-[27px] w-[44px] justify-center rounded-full px-0.5', on ? 'bg-primary' : 'bg-border')}>
      <View
        className={cn(
          'bg-background h-[23px] w-[23px] rounded-full',
          on ? 'self-end' : 'self-start'
        )}
      />
    </Pressable>
  );
}

function MiniIcon({ as }: { as: LucideIcon }) {
  return (
    <IconTile>
      <Icon as={as} size={17} className="text-primary" strokeWidth={1.9} />
    </IconTile>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-6 pt-3">
        {/* Identity */}
        <View className="flex-row items-center gap-4">
          <View className="bg-accent h-[68px] w-[68px] items-center justify-center rounded-[20px]">
            <Text className="text-primary text-2xl font-extrabold">SB</Text>
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-2xl font-extrabold tracking-tight">
              Sarah Bennett
            </Text>
            <Text className="text-muted-foreground mt-0.5 text-[13px] font-medium">
              Reading since 2024
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="mt-6 flex-row gap-2.5">
          {[
            { n: '24', l: 'Saved' },
            { n: '18', l: 'Highlights' },
            { n: '7', l: 'Notes' },
          ].map((s) => (
            <View key={s.l} className="bg-secondary flex-1 items-center rounded-[18px] px-2 py-4">
              <Text className="text-foreground text-2xl font-extrabold">{s.n}</Text>
              <Text className="text-muted-foreground mt-0.5 text-[11px] font-semibold">{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Reading */}
        <SectionLabel className="mb-2.5 mt-7">Reading</SectionLabel>
        <View className="bg-secondary overflow-hidden rounded-[20px]">
          <Row tile={<LetterTile large="A" />} label="Translation" value="Standard" />
          <Row tile={<LetterTile small="A" large="A" />} label="Text Size" />
          <Row tile={<MiniIcon as={Sun} />} label="Appearance" value="Light" isLast />
        </View>

        {/* App */}
        <SectionLabel className="mb-2.5 mt-6">App</SectionLabel>
        <View className="bg-secondary overflow-hidden rounded-[20px]">
          <Row tile={<MiniIcon as={Bell} />} label="Daily Reminder" right={<ReminderToggle />} />
          <Row tile={<MiniIcon as={Download} />} label="Offline Reading" isLast />
        </View>

        <Text className="text-primary mt-7 text-center text-[15px] font-bold">Sign Out</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
