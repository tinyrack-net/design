'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentPropsWithRef } from 'react';
import type { TRFieldAppearance } from '../../core/field-appearance.js';
import type { TRControlUiSize } from '../../core/tokens.js';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { useTinyrackFocusModality } from '../../providers/focus-modality/focus-modality-provider.js';

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
  // The focus ring is gated on input modality, which only JavaScript can tell
  // apart for a text field.
  useTinyrackFocusModality();

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
