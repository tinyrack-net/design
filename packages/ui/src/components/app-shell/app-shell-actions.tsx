import type { ComponentPropsWithRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAppShellActionsProps = ComponentPropsWithRef<'div'>;

export function TRAppShellActions({ className, ...props }: TRAppShellActionsProps) {
  return (
    <div {...props} className={mergeClassNames('tr-app-shell-actions', className)} />
  );
}
