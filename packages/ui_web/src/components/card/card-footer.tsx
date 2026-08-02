import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRCardFooterProps = ComponentProps<'footer'>;

export function TRCardFooter({ className, ...props }: TRCardFooterProps) {
  return <footer {...props} className={mergeClassNames('tr-card-footer', className)} />;
}
