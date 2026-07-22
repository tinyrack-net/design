'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { type ComponentProps, useEffect } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { useTooltipDescriptionContext } from './tooltip-description-context.js';

export type TRTooltipPopupProps = ComponentProps<typeof BaseTooltip.Popup>;

export function TRTooltipPopup({ className, id, role, ...props }: TRTooltipPopupProps) {
  const context = useTooltipDescriptionContext();
  if (context === null) {
    throw new Error('TRTooltip.Popup must be used within TRTooltip.Root.');
  }
  const resolvedId = id ?? context.fallbackId;
  const { setPopupId } = context;

  useEffect(() => {
    setPopupId(resolvedId);
    return () => setPopupId(null);
  }, [resolvedId, setPopupId]);

  return (
    <BaseTooltip.Popup
      {...props}
      className={mergeComponentClassName('tr-layer tr-tooltip-content', className)}
      id={resolvedId}
      role={role ?? 'tooltip'}
    />
  );
}
