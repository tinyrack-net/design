import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAppShellHeaderProps = ComponentProps<'header'>;

export function TRAppShellHeader({ className, ...props }: TRAppShellHeaderProps) {
  return (
    <header {...props} className={mergeClassNames('tr-app-shell-header', className)} />
  );
}
