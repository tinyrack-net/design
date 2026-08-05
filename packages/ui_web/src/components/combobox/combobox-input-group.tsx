'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import type { TRFieldAppearance } from '../../core/field-appearance.js';
import type { TRControlUiSize } from '../../core/tokens.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRComboboxInputGroupProps = ComponentProps<
  typeof BaseCombobox.InputGroup
> & {
  uiSize?: TRControlUiSize;
  appearance?: TRFieldAppearance;
};

export function TRComboboxInputGroup({
  className,
  uiSize = 'md',
  appearance = 'solid',
  ...props
}: TRComboboxInputGroupProps) {
  return (
    <BaseCombobox.InputGroup
      {...props}
      className={mergeComponentClassName(
        'tr-input-group tr-combobox-input-group',
        className,
      )}
      data-appearance={appearance}
      data-ui-size={uiSize}
    />
  );
}
