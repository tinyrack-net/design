'use client';

import type { TooltipTriggerProps } from '@base-ui/react/tooltip';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { useTooltipDescriptionContext } from './tooltip-description-context.js';

export type TRTooltipTriggerProps<Payload = unknown> = TooltipTriggerProps<Payload>;

export function TRTooltipTrigger<Payload = unknown>({
  'aria-describedby': ariaDescribedBy,
  className,
  ...props
}: TRTooltipTriggerProps<Payload>) {
  const context = useTooltipDescriptionContext();
  const describedBy = [ariaDescribedBy, context?.descriptionId]
    .filter(Boolean)
    .join(' ');

  return (
    <BaseTooltip.Trigger
      {...props}
      aria-describedby={describedBy}
      className={mergeComponentClassName('tr-tooltip', className)}
    />
  );
}
