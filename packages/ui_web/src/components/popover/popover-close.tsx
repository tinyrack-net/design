'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPopoverCloseProps = ComponentProps<typeof BasePopover.Close>;
export const TRPopoverClose = createComponentPart(
  BasePopover.Close,
  'tr-popover-close',
);
