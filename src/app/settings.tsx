import { useYVAuth } from '@youversion/platform-react-native-expo-core';
import { YouVersionAuthButton } from '@youversion/platform-react-native-expo-ui';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import type { ThemePreference } from '@/lib/store';
import { useThemePreference } from '@/providers/theme-preference';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

function SectionLabel({ children, className }: { children: string; className?: string }) {
  return (
    <Text
      className={`text-muted-foreground text-xs font-bold uppercase tracking-[0.06em] ${className ?? ''}`}>
      {children}
    </Text>
  );
}

function AccountSection() {
  const { isAuthenticated, userInfo, isLoading } = useYVAuth();

  return (
    <>
      <SectionLabel className="mb-2.5 mt-7">YouVersion account</SectionLabel>
      <View className="bg-secondary rounded-[20px] px-4 py-[15px]">
        <Text className="text-foreground text-base font-medium">
          {isLoading
            ? 'Checking sign-in…'
            : isAuthenticated
              ? userInfo?.name ?? userInfo?.email ?? 'Signed in'
              : 'Not signed in'}
        </Text>
        <Text className="text-muted-foreground mt-1 text-[13px] leading-5">
          Sign in to sync YouVersion features in the reader. Reading works without an account.
        </Text>
        <View className="mt-4 items-center">
          <YouVersionAuthButton mode="auto" />
        </View>
      </View>
    </>
  );
}

function AppearanceSection() {
  const { preference, setPreference } = useThemePreference();

  return (
    <>
      <SectionLabel className="mb-2.5 mt-6">Appearance</SectionLabel>
      <View className="bg-secondary rounded-[20px] px-4 py-[15px]">
        <Text className="text-foreground text-base font-medium">Theme</Text>
        <Text className="text-muted-foreground mt-1 text-[13px] leading-5">
          Choose light, dark, or match your device setting.
        </Text>
        <View className="mt-4 flex-row gap-2">
          {THEME_OPTIONS.map((option) => {
            const selected = preference === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setPreference(option.value)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                className={`flex-1 items-center rounded-xl py-2.5 ${
                  selected ? 'bg-accent' : 'bg-background'
                }`}>
                <Text
                  className={`text-sm font-semibold ${
                    selected ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}

export default function SettingsScreen() {
  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-6 pt-3">
        <Text className="text-foreground text-3xl font-extrabold tracking-tight">Settings</Text>

        <AccountSection />

        <AppearanceSection />

        <Text className="text-muted-foreground mt-7 px-2 text-center text-[13px] leading-5">
          Scripture content is provided by YouVersion. Version-specific copyright attributions appear
          in the reader where required.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
