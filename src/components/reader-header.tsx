import { useYouVersion } from '@youversion/platform-react-native-expo-core';
import { ChevronDown } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { chapterLabel } from '@/lib/reference';

/**
 * The design paints the header glyphs (the `Aa` label, the headphones icon) in a
 * mid-gray that sits between `--foreground` and `--muted-foreground`; no existing
 * token matches it, so the two design hexes are inlined here only for that ink.
 * Every surface, border, and text color below uses a theme token.
 */
const GLYPH_INK = 'text-[#4A4E57] dark:text-[#C4C8CF]';

/**
 * Chip / button skin shared by every control. Deliberately carries no width or
 * height: the row is `items-stretch`, so each control takes its height from the
 * tallest sibling and its width from its own content. Long book names and larger
 * accessibility text sizes then grow the whole row together instead of
 * overflowing a hardcoded box.
 */
const CONTROL_SURFACE = 'bg-secondary dark:border-border justify-center py-2.5 dark:border';

const PILL = 'rounded-full';

type ReaderHeaderProps = {
  book: string;
  chapter: string;
  versionId: number;
  onPressChapter: () => void;
  onPressVersion: () => void;
  onPressSettings: () => void;
};

/**
 * Resolves the short version abbreviation (e.g. `BSB`) for the version chip.
 *
 * The SDK exposes no hook for version metadata, so this hits the same public
 * endpoint its own pickers use. Falls back to the numeric id while in flight.
 */
function useVersionAbbreviation(versionId: number) {
  const { appKey, apiHost } = useYouVersion();
  // Keyed by the version it describes so a stale label never renders against a
  // newly selected version (and so the effect never has to setState eagerly).
  const [resolved, setResolved] = useState<{ versionId: number; abbreviation: string } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    fetch(`https://${apiHost}/v1/bibles/${versionId}`, {
      headers: { 'X-YVP-App-Key': appKey },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const next = data.localized_abbreviation ?? data.abbreviation;
        if (typeof next === 'string' && next) {
          setResolved({ versionId, abbreviation: next.toUpperCase() });
        }
      })
      .catch(() => {
        // Non-fatal: the chip falls back to a neutral label.
      });

    return () => {
      cancelled = true;
    };
  }, [apiHost, appKey, versionId]);

  return resolved?.versionId === versionId ? resolved.abbreviation : null;
}

export function ReaderHeader({
  book,
  chapter,
  versionId,
  onPressChapter,
  onPressVersion,
  onPressSettings,
}: ReaderHeaderProps) {
  const abbreviation = useVersionAbbreviation(versionId);

  return (
    // `items-stretch` is what keeps the controls on one baseline: the tallest
    // child (the chapter chip) sets the row height from its own text and padding,
    // and the others fill to match. Nothing is measured against a fixed box.
    <View className="border-border bg-background flex-row items-stretch gap-2 border-b px-[18px] pb-3 pt-[5px]">
      <View className="min-w-0 flex-1 flex-row items-stretch gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Change chapter, currently ${chapterLabel(book, chapter)}`}
          onPress={onPressChapter}
          className={`${CONTROL_SURFACE} ${PILL} min-w-0 shrink flex-row items-center gap-[7px] px-[14px]`}>
          <Text
            numberOfLines={1}
            className="text-foreground shrink text-base font-bold">
            {chapterLabel(book, chapter)}
          </Text>
          <Icon
            as={ChevronDown}
            size={15}
            strokeWidth={2.2}
            className="text-muted-foreground shrink-0"
          />
        </Pressable>

        {/* Not in the static design, which has no version affordance at all — but the
            reader has to be able to switch translations, so it borrows the chip skin. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change Bible version"
          onPress={onPressVersion}
          className={`${CONTROL_SURFACE} ${PILL} shrink-0 flex-row items-center gap-[5px] px-3`}>
          <Text className={`${GLYPH_INK} text-[13px] font-bold`}>{abbreviation ?? '—'}</Text>
          <Icon
            as={ChevronDown}
            size={13}
            strokeWidth={2.2}
            className="text-muted-foreground shrink-0"
          />
        </Pressable>
      </View>

      {/* The design also shows a listen button here; it is omitted because the
          YouVersion Expo SDK ships no audio/TTS API to back it. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reader display settings"
        onPress={onPressSettings}
        // `aspect-square` keeps it a true circle rather than an oval: the row's
        // stretch sets the height, and the width follows it instead of being
        // decided by the glyph's own width plus padding.
        className={`${CONTROL_SURFACE} ${PILL} aspect-square shrink-0 flex-row items-center`}>
        <Text className={`${GLYPH_INK} text-base font-bold`}>
          A<Text className={`${GLYPH_INK} text-xs font-bold`}>a</Text>
        </Text>
      </Pressable>
    </View>
  );
}
