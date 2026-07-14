'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PopoverTriggerProps = ComponentProps<typeof BasePopover.Trigger>;
export const PopoverTrigger = createComponentPart(
  BasePopover.Trigger,
  'tr-popover-trigger',
);
