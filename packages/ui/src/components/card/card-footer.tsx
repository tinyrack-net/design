import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type CardFooterProps = ComponentProps<'footer'>;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <footer {...props} className={mergeClassNames('tr-card-footer', className)} />;
}
