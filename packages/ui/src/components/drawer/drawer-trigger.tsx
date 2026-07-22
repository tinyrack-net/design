'use client';

import type { DrawerTriggerProps } from '@base-ui/react/drawer';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { Ref } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRDrawerTriggerProps<Payload = unknown> = DrawerTriggerProps<Payload> & {
  ref?: Ref<HTMLElement>;
};

export function TRDrawerTrigger<Payload = unknown>({
  className,
  ...props
}: TRDrawerTriggerProps<Payload>) {
  return (
    <BaseDrawer.Trigger
      {...props}
      className={mergeComponentClassName('tr-drawer-trigger', className)}
    />
  );
}
