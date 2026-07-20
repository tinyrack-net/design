import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAppShellSidebarLabelProps = ComponentProps<'span'>;

export function TRAppShellSidebarLabel({
  className,
  ...props
}: TRAppShellSidebarLabelProps) {
  return (
    <span
      {...props}
      className={mergeClassNames('tr-app-shell-sidebar-label', className)}
    />
  );
}
