import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type CardHeaderProps = ComponentProps<'header'>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <header {...props} className={mergeClassNames('tr-card-header', className)} />;
}
