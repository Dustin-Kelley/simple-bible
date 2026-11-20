import { YouVersionAuthButton } from '@youversion/platform-react-native-expo-ui';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppleSignInButton } from '@/components/apple-sign-in-button';
import { Text } from '@/components/ui/text';
import type { AuthState } from '@/lib/auth-state';
import type { ThemePreference } from '@/lib/store';
import { useAuthState } from '@/providers/apple-auth';
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

function accountTitle(state: AuthState, isLoading: boolean): string {
  if (isLoading && state.status === 'signed-out') return 'Checking sign-in…';
  if (state.status === 'signed-out') return 'Not signed in';
  if (state.name) return state.name;
  if (state.email) return state.email;
  if (state.status === 'youversion') return 'Signed in with YouVersion';
  return 'Signed in with Apple';
}

function accountDetail(state: AuthState): string {
  if (state.status === 'apple') {
    return 'Signed in with Apple on this device. Highlight sync uses a YouVersion account, not Apple.';
  }
  if (state.status === 'youversion') {
    return 'Signed in with YouVersion. Highlights sync with this account.';
  }
  return 'Sign in with Apple or YouVersion. Highlight sync uses YouVersion. Apple sign-in stays on this device. Reading works without an account.';
}

function AccountSection() {
  const { colorScheme } = useThemePreference();
  const { state, isLoading, appleAvailable, appleError, signInWithApple, signOutApple } =
    useAuthState();
  const showAppleSignIn = appleAvailable && state.status !== 'apple';

  return (
    <>
      <SectionLabel className="mb-2.5 mt-7">Account</SectionLabel>
      <View className="bg-secondary rounded-[20px] px-4 py-[15px]">
        <Text className="text-foreground text-base font-medium">{accountTitle(state, isLoading)}</Text>
        <Text className="text-muted-foreground mt-1 text-[13px] leading-5">{accountDetail(state)}</Text>
        <View className="mt-4 w-full gap-3">
          {showAppleSignIn ? (
            <AppleSignInButton
              colorScheme={colorScheme}
              onPress={() => {
                void signInWithApple();
              }}
            />
          ) : null}
          {state.status === 'apple' ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void signOutApple();
              }}
              className="border-border bg-background h-12 w-full items-center justify-center rounded-full border">
              <Text className="text-foreground text-sm font-semibold">Sign out</Text>
            </Pressable>
          ) : null}
          <View className="w-full items-stretch">
            <YouVersionAuthButton mode="auto" />
          </View>
        </View>
        {appleError ? (
          <Text className="text-destructive mt-3 text-center text-[13px] leading-5">{appleError}</Text>
        ) : null}
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
