'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';

export function createMenuHandle<Payload>() {
  return BaseMenu.createHandle<Payload>();
}

export type TRMenuHandle<Payload> = ReturnType<typeof createMenuHandle<Payload>>;
