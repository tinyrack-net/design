'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';

export function createPopoverHandle<Payload>() {
  return BasePopover.createHandle<Payload>();
}

export type TRPopoverHandle<Payload> = ReturnType<typeof createPopoverHandle<Payload>>;
