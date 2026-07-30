import { useEffect, useState } from 'react';
import { Image, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';

/** Matches `imageWidth` in the expo-splash-screen config so the icon never jumps. */
const ICON_SIZE = 100;
const CAPTION_DURATION = 260;
const HOLD = 420;
const FADE_DURATION = 400;

const LIGHT_ICON = require('../../assets/images/splash-icon.png');
const DARK_ICON = require('../../assets/images/splash-icon-dark.png');

export function AnimatedSplashOverlay() {
  const colorScheme = useColorScheme();
  const [visible, setVisible] = useState(true);
  const theme = colorScheme === 'dark' ? THEME.dark : THEME.light;

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const captionOpacity = useSharedValue(0);
  const captionOffset = useSharedValue(8);

  useEffect(() => {
    const easing = Easing.out(Easing.quad);

    captionOpacity.value = withTiming(1, { duration: CAPTION_DURATION, easing });
    captionOffset.value = withTiming(0, { duration: CAPTION_DURATION, easing });

    scale.value = withDelay(HOLD, withTiming(1.06, { duration: FADE_DURATION, easing }));
    opacity.value = withDelay(
      HOLD,
      withTiming(0, { duration: FADE_DURATION, easing }, (finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })
    );
  }, [captionOffset, captionOpacity, opacity, scale]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const contentStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const captionStyle = useAnimatedStyle(() => ({
    opacity: captionOpacity.value,
    transform: [{ translateY: captionOffset.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.overlay, { backgroundColor: theme.background }, overlayStyle]}>
      <Animated.View style={[styles.content, contentStyle]}>
        <Animated.View style={styles.icon}>
          <Image
            source={colorScheme === 'dark' ? DARK_ICON : LIGHT_ICON}
            style={styles.iconImage}
            resizeMode="contain"
          />
          <Animated.View style={[styles.caption, captionStyle]}>
            <Text className="text-foreground text-3xl font-extrabold tracking-tight">
              Simple Bible
            </Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },
  content: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  iconImage: {
    width: '100%',
    height: '100%',
  },
  caption: {
    position: 'absolute',
    top: '100%',
    left: -150,
    right: -150,
    marginTop: 16,
    alignItems: 'center',
  },
});
