import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type AlertDescriptionProps = ComponentProps<'p'>;

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <p {...props} className={mergeClassNames('tr-alert-description', className)} />
  );
}
