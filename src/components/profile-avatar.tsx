import { useYVAuth } from '@youversion/platform-react-native-expo-core';
import { Image } from 'expo-image';
import { User } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

/** First letters of the first two name parts, e.g. "Sarah Bennett" -> "SB". */
function initialsFrom(name: string | null | undefined) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return null;
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

type ProfileAvatarProps = {
  onPress?: () => void;
  /**
   * Diameter in points. An avatar is one of the few things that genuinely needs
   * a concrete size, so it's a prop rather than a utility class — the Profile
   * screen renders the same component larger.
   */
  size?: number;
};

/**
 * The signed-in user's picture, falling back to their initials on the design's
 * pink tile, then to a neutral glyph when signed out.
 */
export function ProfileAvatar({ onPress, size = 48 }: ProfileAvatarProps) {
  const { isAuthenticated, userInfo } = useYVAuth();

  const avatarUrl = isAuthenticated ? userInfo?.avatarUrl : null;
  const initials = isAuthenticated ? initialsFrom(userInfo?.name) : null;

  const box = { width: size, height: size, borderRadius: size / 2 };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isAuthenticated ? 'Open your profile' : 'Sign in'}
      onPress={onPress}
      // shrink-0 so a long greeting never squashes the avatar into an oval.
      className="shrink-0 overflow-hidden"
      style={box}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={box}
          contentFit="cover"
          transition={150}
          accessibilityIgnoresInvertColors
        />
      ) : initials ? (
        <View className="bg-accent h-full w-full items-center justify-center">
          <Text
            className="text-primary font-extrabold"
            style={{ fontSize: Math.round(size * 0.34) }}>
            {initials}
          </Text>
        </View>
      ) : (
        <View className="bg-secondary dark:border-border h-full w-full items-center justify-center dark:border">
          <Icon
            as={User}
            size={Math.round(size * 0.5)}
            strokeWidth={1.8}
            className="text-muted-foreground"
          />
        </View>
      )}
    </Pressable>
  );
}
