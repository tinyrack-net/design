'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentPropsWithRef } from 'react';
import type { TRFieldAppearance } from '../../core/field-appearance.js';
import type { TRControlUiSize } from '../../core/tokens.js';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { useTinyrackFocusModality } from '../../providers/focus-modality/focus-modality-provider.js';

export type TRNativeSelectUiSize = TRControlUiSize;
export type TRNativeSelectAppearance = TRFieldAppearance;
export type TRNativeSelectProps = ComponentPropsWithRef<'select'> & {
  uiSize?: TRNativeSelectUiSize;
  appearance?: TRNativeSelectAppearance;
};

type BaseFieldControlProps = ComponentPropsWithRef<typeof BaseField.Control>;

export function TRNativeSelect({
  appearance = 'solid',
  className,
  multiple,
  size,
  uiSize = 'md',
  ...props
}: TRNativeSelectProps) {
  useTinyrackFocusModality();

  const presentation =
    multiple || (size !== undefined && size > 1) ? 'listbox' : 'trigger';

  return (
    <BaseField.Control
      {...({ ...props, multiple, size } as BaseFieldControlProps)}
      className={mergeClassNames('tr-native-select', className)}
      data-appearance={appearance}
      data-presentation={presentation}
      data-ui-size={uiSize}
      render={<select />}
    />
  );
}
