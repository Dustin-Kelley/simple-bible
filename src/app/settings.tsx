import { useYVAuth } from '@youversion/platform-react-native-expo-core';
import { YouVersionAuthButton } from '@youversion/platform-react-native-expo-ui';
import Constants from 'expo-constants';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

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
        <View className="mt-4 items-start">
          <YouVersionAuthButton mode="auto" size="default" radius="rounded" />
        </View>
      </View>
    </>
  );
}

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView edges={['top']} className="bg-background flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-6 pt-3">
        <Text className="text-foreground text-3xl font-extrabold tracking-tight">Settings</Text>

        <AccountSection />

        <SectionLabel className="mb-2.5 mt-6">Reading</SectionLabel>
        <View className="bg-secondary rounded-[20px] px-4 py-[15px]">
          <Text className="text-foreground text-base font-medium">Text size &amp; version</Text>
          <Text className="text-muted-foreground mt-1 text-[13px] leading-5">
            Use the reader toolbar to change font size, spacing, and Bible version.
          </Text>
        </View>

        <SectionLabel className="mb-2.5 mt-6">About</SectionLabel>
        <View className="bg-secondary rounded-[20px] px-4 py-[15px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-base font-medium">Version</Text>
            <Text className="text-muted-foreground text-sm font-medium">{version}</Text>
          </View>
        </View>

        <Text className="text-muted-foreground mt-7 px-2 text-center text-[13px] leading-5">
          Scripture content is provided by YouVersion. Version-specific copyright attributions appear
          in the reader where required.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
