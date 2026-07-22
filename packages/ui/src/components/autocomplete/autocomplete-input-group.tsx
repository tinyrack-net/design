'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRAutocompleteInputGroupProps = ComponentProps<
  typeof BaseAutocomplete.InputGroup
> & {
  uiSize?: TRControlUiSize;
};

export function TRAutocompleteInputGroup({
  className,
  uiSize = 'md',
  ...props
}: TRAutocompleteInputGroupProps) {
  return (
    <BaseAutocomplete.InputGroup
      {...props}
      className={mergeComponentClassName(
        'tr-input-group tr-autocomplete-input-group',
        className,
      )}
      data-ui-size={uiSize}
    />
  );
}
