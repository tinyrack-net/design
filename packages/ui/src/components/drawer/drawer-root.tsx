'use client';

import type { DrawerRootProps } from '@base-ui/react/drawer';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';

export type TRDrawerRootProps<Payload = unknown> = DrawerRootProps<Payload>;

export function TRDrawerRoot<Payload = unknown>(props: TRDrawerRootProps<Payload>) {
  return <BaseDrawer.Root {...props} />;
}
