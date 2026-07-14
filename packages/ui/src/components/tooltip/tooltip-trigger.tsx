'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { useTooltipDescriptionContext } from './tooltip-description-context.js';

export type TooltipTriggerProps = ComponentProps<typeof BaseTooltip.Trigger>;

export function TooltipTrigger({
  'aria-describedby': ariaDescribedBy,
  className,
  ...props
}: TooltipTriggerProps) {
  const context = useTooltipDescriptionContext();
  const describedBy = [ariaDescribedBy, context.descriptionId]
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
