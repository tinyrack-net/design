'use client';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type { ComponentProps } from 'react';
import type { TRControlUiSize } from '../../core/tokens/control-metrics.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRComboboxInputGroupProps = ComponentProps<
  typeof BaseCombobox.InputGroup
> & {
  uiSize?: TRControlUiSize;
};

export function TRComboboxInputGroup({
  className,
  uiSize = 'md',
  ...props
}: TRComboboxInputGroupProps) {
  return (
    <BaseCombobox.InputGroup
      {...props}
      className={mergeComponentClassName(
        'tr-input-group tr-combobox-input-group',
        className,
      )}
      data-ui-size={uiSize}
    />
  );
}
