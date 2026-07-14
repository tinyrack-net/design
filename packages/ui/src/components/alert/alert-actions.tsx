import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type AlertActionsProps = ComponentProps<'div'>;

export function AlertActions({ className, ...props }: AlertActionsProps) {
  return <div {...props} className={mergeClassNames('tr-alert-actions', className)} />;
}
