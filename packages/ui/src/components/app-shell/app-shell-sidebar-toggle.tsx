'use client';

import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { TRIconButton, type TRIconButtonProps } from '../icon-button/index.js';
import { useAppShellContext } from './app-shell-context.js';

export type TRAppShellSidebarToggleProps = TRIconButtonProps;

export function TRAppShellSidebarToggle({
  appearance = 'ghost',
  className,
  onClick,
  uiSize = 'sm',
  ...props
}: TRAppShellSidebarToggleProps) {
  const { mobile, setSidebarMode, sidebarMode } = useAppShellContext('SidebarToggle');
  if (mobile) return null;

  return (
    <TRIconButton
      {...props}
      appearance={appearance}
      aria-expanded={sidebarMode === 'expanded'}
      className={mergeComponentClassName('tr-app-shell-sidebar-toggle', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setSidebarMode(sidebarMode === 'expanded' ? 'rail' : 'expanded');
        }
      }}
      uiSize={uiSize}
    />
  );
}
