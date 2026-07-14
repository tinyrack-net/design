import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type ComboboxInputAdornmentProps = ComponentProps<'span'> & {
  side?: 'end' | 'start';
};

export function ComboboxInputAdornment({
  className,
  side = 'start',
  ...props
}: ComboboxInputAdornmentProps) {
  return (
    <span
      {...props}
      className={mergeClassNames(
        'tr-input-group-adornment tr-combobox-input-adornment',
        className,
      )}
      data-side={side}
    />
  );
}
