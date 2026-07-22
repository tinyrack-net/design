'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ReactElement, RefAttributes } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRPopoverTriggerProps<Payload = unknown> =
  BasePopover.Trigger.Props<Payload> & RefAttributes<HTMLElement>;

export function TRPopoverTrigger<Payload = unknown>({
  className,
  ...props
}: TRPopoverTriggerProps<Payload>): ReactElement {
  return (
    <BasePopover.Trigger
      {...props}
      className={mergeComponentClassName('tr-popover-trigger', className)}
    />
  );
}
