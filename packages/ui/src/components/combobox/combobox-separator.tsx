import type { SeparatorState } from '@base-ui/react/separator';
import { mergeClassNames } from '../../internal/component-class-name.js';
import type { TRSeparatorProps } from '../separator/index.js';
import { TRSeparator } from '../separator/index.js';

export type TRComboboxSeparatorProps = TRSeparatorProps;
export type TRComboboxSeparatorState = SeparatorState;

export function TRComboboxSeparator({ className, ...props }: TRComboboxSeparatorProps) {
  return (
    <TRSeparator
      {...props}
      className={(state) =>
        mergeClassNames(
          'tr-combobox-separator',
          typeof className === 'function' ? className(state) : className,
        )
      }
    />
  );
}
