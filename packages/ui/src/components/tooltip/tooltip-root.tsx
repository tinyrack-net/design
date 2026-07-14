'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { type ComponentProps, useId, useMemo, useState } from 'react';
import { TooltipDescriptionProvider } from './tooltip-description-context.js';

export type TooltipRootProps = ComponentProps<typeof BaseTooltip.Root>;

export function TooltipRoot(props: TooltipRootProps) {
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
