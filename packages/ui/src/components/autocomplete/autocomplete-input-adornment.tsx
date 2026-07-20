import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAutocompleteInputAdornmentProps = ComponentProps<'span'> & {
  side?: 'end' | 'start';
};

export function TRAutocompleteInputAdornment({
  className,
  side = 'start',
  ...props
}: TRAutocompleteInputAdornmentProps) {
  return (
    <span
      {...props}
      className={mergeClassNames(
        'tr-input-group-adornment tr-autocomplete-input-adornment',
        className,
      )}
      data-side={side}
    />
  );
}
