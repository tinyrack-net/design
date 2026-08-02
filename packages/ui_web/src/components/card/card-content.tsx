import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRCardContentProps = ComponentProps<'div'>;

export function TRCardContent({ className, ...props }: TRCardContentProps) {
  return <div {...props} className={mergeClassNames('tr-card-content', className)} />;
}
