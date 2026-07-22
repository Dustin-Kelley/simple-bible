import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { BookOpen, House, Search, Settings } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabButton } from '@/components/tab-button';

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <View
          className="bg-background border-border flex-row border-t px-1.5 pt-2.5"
          style={{ paddingBottom: insets.bottom + 10 }}>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon={House} label="Home" />
          </TabTrigger>
          <TabTrigger name="read" href="/read" asChild>
            <TabButton icon={BookOpen} label="Read" />
          </TabTrigger>
          <TabTrigger name="search" href="/search" asChild>
            <TabButton icon={Search} label="Find" />
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton icon={Settings} label="Settings" />
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}
