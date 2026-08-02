import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTableCaptionProps = ComponentProps<'caption'>;

export function TRTableCaption({ className, ...props }: TRTableCaptionProps) {
  return (
    <caption {...props} className={mergeClassNames('tr-table-caption', className)} />
  );
}
