import type { ComponentPropsWithRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAppShellOutlineProps = ComponentPropsWithRef<'aside'>;

export function TRAppShellOutline({ className, ...props }: TRAppShellOutlineProps) {
  return (
    <aside {...props} className={mergeClassNames('tr-app-shell-outline', className)} />
  );
}
