'use client';

import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { Drawer } from '../drawer/index.js';
import { IconButton, type IconButtonProps } from '../icon-button/index.js';
import { useAppShellContext } from './app-shell-context.js';

export type AppShellCloseProps = IconButtonProps;

export function AppShellClose({
  appearance = 'ghost',
  className,
  size = 'sm',
  ...props
}: AppShellCloseProps) {
  const { mobile } = useAppShellContext('Close');
  const button = (
    <IconButton
      {...props}
      appearance={appearance}
      className={mergeComponentClassName('tr-app-shell-close', className)}
      size={size}
    />
  );
  if (!mobile) return button;
  return <Drawer.Close render={button} />;
}
