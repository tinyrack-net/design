'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentPropsWithRef } from 'react';
import type { TRFieldAppearance } from '../../core/field-appearance.js';
import type { TRControlUiSize } from '../../core/tokens.js';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTextareaUiSize = TRControlUiSize;
export type TRTextareaAppearance = TRFieldAppearance;
export type TRTextareaProps = ComponentPropsWithRef<'textarea'> & {
  uiSize?: TRTextareaUiSize;
  appearance?: TRTextareaAppearance;
};

type BaseFieldControlProps = ComponentPropsWithRef<typeof BaseField.Control>;

export function TRTextarea({
  className,
  uiSize = 'md',
  appearance = 'solid',
  ...props
}: TRTextareaProps) {
  return (
    <BaseField.Control
      {...(props as BaseFieldControlProps)}
      className={mergeClassNames('tr-textarea', className)}
      data-appearance={appearance}
      data-ui-size={uiSize}
      render={<textarea />}
    />
  );
}
