import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import { forwardRef } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

type TabButtonProps = PressableProps & {
  icon: LucideIcon;
  label: string;
  /** Injected by `<TabTrigger asChild>` when this tab is active. */
  isFocused?: boolean;
};

/**
 * Bottom-tab button matching the Simple Bible design — stacked icon + label,
 * red (`primary`) when active, muted gray otherwise. Designed to be used as the
 * child of an `<TabTrigger asChild>` so it receives `isFocused`/`onPress`.
 */
export const TabButton = forwardRef<View, TabButtonProps>(
  ({ icon, label, isFocused, style, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className="flex-1 flex-col items-center justify-center gap-1.5"
        {...props}>
        <Icon
          as={icon}
          size={24}
          strokeWidth={1.9}
          className={isFocused ? 'text-primary' : 'text-muted-foreground'}
        />
        <Text
          className={cn(
            'text-[11px]',
            isFocused ? 'text-primary font-bold' : 'text-muted-foreground font-semibold'
          )}>
          {label}
        </Text>
      </Pressable>
    );
  }
);

TabButton.displayName = 'TabButton';
