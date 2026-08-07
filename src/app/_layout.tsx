import '@/global.css';

import { YouVersionProvider } from '@youversion/platform-react-native-expo-ui';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { Text } from '@/components/ui/text';
import { NAV_THEME } from '@/lib/theme';
import { AUTH_REDIRECT_URI } from '@/lib/youversion';
import {
  ThemePreferenceProvider,
  useThemePreference,
} from '@/providers/theme-preference';

function MissingAppKey() {
  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      <Text className="text-foreground text-center text-lg font-bold">Missing YouVersion App Key</Text>
      <Text className="text-muted-foreground mt-3 text-center text-sm leading-5">
        Set EXPO_PUBLIC_YOUVERSION_APP_KEY in .env.local and restart Metro.
      </Text>
    </View>
  );
}

function AppProviders({ appKey }: { appKey: string }) {
  const { preference, colorScheme } = useThemePreference();

  return (
    <YouVersionProvider
      appKey={appKey}
      theme={preference === 'system' ? 'system' : preference}
      auth={{ redirectUri: AUTH_REDIRECT_URI }}
      fallback={
        <View className="bg-background flex-1 items-center justify-center">
          <Text className="text-muted-foreground text-sm">Loading Bible…</Text>
        </View>
      }>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <AnimatedSplashOverlay />
        <AppTabs />
        <PortalHost />
      </ThemeProvider>
    </YouVersionProvider>
  );
}

export default function RootLayout() {
  const appKey = process.env.EXPO_PUBLIC_YOUVERSION_APP_KEY;

  if (!appKey) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MissingAppKey />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemePreferenceProvider>
        <AppProviders appKey={appKey} />
      </ThemePreferenceProvider>
    </GestureHandlerRootView>
  );
}
