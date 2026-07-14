import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type CardDescriptionProps = ComponentProps<'p'>;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p {...props} className={mergeClassNames('tr-card-description', className)} />;
}
