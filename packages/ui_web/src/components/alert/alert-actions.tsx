import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAlertActionsProps = ComponentProps<'div'>;

export function TRAlertActions({ className, ...props }: TRAlertActionsProps) {
  return <div {...props} className={mergeClassNames('tr-alert-actions', className)} />;
}
