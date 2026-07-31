'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { ComponentPropsWithRef } from 'react';
import type { TRControlUiSize } from '../../core/tokens.js';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTextareaUiSize = TRControlUiSize;
export type TRTextareaProps = ComponentPropsWithRef<'textarea'> & {
  uiSize?: TRTextareaUiSize;
};

type BaseFieldControlProps = ComponentPropsWithRef<typeof BaseField.Control>;

export function TRTextarea({ className, uiSize = 'md', ...props }: TRTextareaProps) {
  return (
    <BaseField.Control
      {...(props as BaseFieldControlProps)}
      className={mergeClassNames('tr-textarea', className)}
      data-ui-size={uiSize}
      render={<textarea />}
    />
  );
}
