import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRComboboxInputAdornmentProps = ComponentProps<'span'> & {
  side?: 'end' | 'start';
};

export function TRComboboxInputAdornment({
  className,
  side = 'start',
  ...props
}: TRComboboxInputAdornmentProps) {
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
