'use client';

import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { TRDrawer } from '../drawer/index.js';
import { TRIconButton, type TRIconButtonProps } from '../icon-button/index.js';
import { useAppShellContext } from './app-shell-context.js';

export type TRAppShellCloseProps = TRIconButtonProps;

export function TRAppShellClose({
  appearance = 'ghost',
  className,
  uiSize = 'sm',
  ...props
}: TRAppShellCloseProps) {
  const { drawerActive, mobile } = useAppShellContext('Close');
  if (mobile && !drawerActive) return null;
  const button = (
    <TRIconButton
      {...props}
      appearance={appearance}
      className={mergeComponentClassName('tr-app-shell-close', className)}
      uiSize={uiSize}
    />
  );
  if (!drawerActive) return button;
  return <TRDrawer.Close render={button} />;
}
