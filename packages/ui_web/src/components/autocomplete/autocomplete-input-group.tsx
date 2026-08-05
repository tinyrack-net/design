'use client';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import type { ComponentProps } from 'react';
import type { TRFieldAppearance } from '../../core/field-appearance.js';
import type { TRControlUiSize } from '../../core/tokens.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRAutocompleteInputGroupProps = ComponentProps<
  typeof BaseAutocomplete.InputGroup
> & {
  uiSize?: TRControlUiSize;
  appearance?: TRFieldAppearance;
};

export function TRAutocompleteInputGroup({
  className,
  uiSize = 'md',
  appearance = 'solid',
  ...props
}: TRAutocompleteInputGroupProps) {
  return (
    <BaseAutocomplete.InputGroup
      {...props}
      className={mergeComponentClassName(
        'tr-input-group tr-autocomplete-input-group',
        className,
      )}
      data-appearance={appearance}
      data-ui-size={uiSize}
    />
  );
}
