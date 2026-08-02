import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRCardHeaderProps = ComponentProps<'header'>;

export function TRCardHeader({ className, ...props }: TRCardHeaderProps) {
  return <header {...props} className={mergeClassNames('tr-card-header', className)} />;
}
