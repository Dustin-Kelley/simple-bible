import { cn } from '@/lib/utils';
import { type ViewProps, View } from 'react-native';

type SeparatorProps = ViewProps &
  React.RefAttributes<View> & {
    orientation?: 'horizontal' | 'vertical';
  };

function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  return (
    <View
      role="none"
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  );
}

export { Separator };
