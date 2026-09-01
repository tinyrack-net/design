import type { ComponentPropsWithRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRRichTextVariant = 'document' | 'notice';

export type TRRichTextProps = Omit<
  ComponentPropsWithRef<'div'>,
  'dangerouslySetInnerHTML'
> & {
  variant?: TRRichTextVariant;
};

export function TRRichText({
  className,
  variant = 'document',
  ...props
}: TRRichTextProps) {
  return (
    <div
      {...props}
      className={mergeClassNames('tr-rich-text', className)}
      data-variant={variant}
    />
  );
}
