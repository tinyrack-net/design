'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';

export function createDrawerHandle<Payload>() {
  return BaseDrawer.createHandle<Payload>();
}

export type DrawerHandle<Payload> = ReturnType<typeof createDrawerHandle<Payload>>;
