import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRCardDescriptionProps = ComponentProps<'p'>;

export function TRCardDescription({ className, ...props }: TRCardDescriptionProps) {
  return <p {...props} className={mergeClassNames('tr-card-description', className)} />;
}
