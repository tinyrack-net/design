'use client';

import { useCallback } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { Drawer } from '../drawer/index.js';
import { IconButton, type IconButtonProps } from '../icon-button/index.js';
import { useAppShellContext } from './app-shell-context.js';

export type AppShellTriggerProps = IconButtonProps;

export function AppShellTrigger({
  appearance = 'ghost',
  className,
  ref,
  size = 'sm',
  ...props
}: AppShellTriggerProps) {
  const { drawerHandle, triggerRef } = useAppShellContext('Trigger');
  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref, triggerRef],
  );
  return (
    <Drawer.Trigger
      handle={drawerHandle}
      render={
        <IconButton
          {...props}
          appearance={appearance}
          className={mergeComponentClassName('tr-app-shell-trigger', className)}
          ref={setTriggerRef}
          size={size}
        />
      }
    />
  );
}
