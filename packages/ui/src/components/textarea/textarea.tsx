import type { ComponentPropsWithRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTextareaUiSize = 'sm' | 'md' | 'lg';
export type TRTextareaProps = ComponentPropsWithRef<'textarea'> & {
  uiSize?: TRTextareaUiSize;
};

export function TRTextarea({ className, uiSize = 'md', ...props }: TRTextareaProps) {
  return (
    <textarea
      {...props}
      className={mergeClassNames('tr-textarea', className)}
      data-ui-size={uiSize}
    />
  );
}
