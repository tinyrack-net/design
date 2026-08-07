'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentProps } from 'react';
import type { TRControlUiSize } from '../../core/tokens.js';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { useTinyrackFocusModality } from '../../providers/focus-modality/focus-modality-provider.js';

export type TRFieldControlProps = ComponentProps<typeof BaseField.Control> & {
  uiSize?: TRControlUiSize;
};

export function TRFieldControl({
  className,
  uiSize = 'md',
  ...props
}: TRFieldControlProps) {
  // The focus ring is gated on input modality, which only JavaScript can tell
  // apart for a text field.
  useTinyrackFocusModality();

  return (
    <BaseField.Control
      {...props}
      className={mergeComponentClassName('tr-field-control', className)}
      data-ui-size={uiSize}
    />
  );
}
