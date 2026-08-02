'use client';

import type { TooltipRootProps } from '@base-ui/react/tooltip';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { useId, useMemo, useState } from 'react';
import { TooltipDescriptionProvider } from './tooltip-description-context.js';

export type TRTooltipRootProps<Payload = unknown> = TooltipRootProps<Payload>;

export function TRTooltipRoot<Payload = unknown>(props: TRTooltipRootProps<Payload>) {
  const fallbackId = useId();
  const [popupId, setPopupId] = useState<string | null>(null);
  const descriptionContext = useMemo(
    () => ({
      descriptionId: popupId ?? fallbackId,
      fallbackId,
      setPopupId,
    }),
    [fallbackId, popupId],
  );

  return (
    <TooltipDescriptionProvider value={descriptionContext}>
      <BaseTooltip.Root {...props} />
    </TooltipDescriptionProvider>
  );
}
