'use client';

import { useCallback } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { TRDrawer } from '../drawer/index.js';
import { TRIconButton, type TRIconButtonProps } from '../icon-button/index.js';
import { useAppShellContext } from './app-shell-context.js';

export type TRAppShellTriggerProps = TRIconButtonProps;

export function TRAppShellTrigger({
  appearance = 'ghost',
  className,
  ref,
  uiSize = 'sm',
  ...props
}: TRAppShellTriggerProps) {
  const { drawerActive, drawerHandle, mobile, triggerRef } =
    useAppShellContext('Trigger');
  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref, triggerRef],
  );
  if (mobile && !drawerActive) return null;
  return (
    <TRDrawer.Trigger
      handle={drawerHandle}
      render={
        <TRIconButton
          {...props}
          appearance={appearance}
          className={mergeComponentClassName('tr-app-shell-trigger', className)}
          ref={setTriggerRef}
          uiSize={uiSize}
        />
      }
    />
  );
}
