'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

export function createTooltipHandle<Payload>() {
  return BaseTooltip.createHandle<Payload>();
}

export type TRTooltipHandle<Payload> = ReturnType<typeof createTooltipHandle<Payload>>;
