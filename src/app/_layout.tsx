import '@/global.css';

import { YouVersionProvider } from '@youversion/platform-react-native-expo-ui';
import { PortalHost } from '@rn-primitives/portal';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { Text } from '@/components/ui/text';
import { AUTH_REDIRECT_URI } from '@/lib/youversion';

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

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
      <YouVersionProvider
        appKey={appKey}
        theme="system"
        auth={{ redirectUri: AUTH_REDIRECT_URI }}
        fallback={
          <View className="bg-background flex-1 items-center justify-center">
            <Text className="text-muted-foreground text-sm">Loading Bible…</Text>
          </View>
        }>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <AppTabs />
          <PortalHost />
        </ThemeProvider>
      </YouVersionProvider>
    </GestureHandlerRootView>
  );
}
