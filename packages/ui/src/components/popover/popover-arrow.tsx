'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPopoverArrowProps = ComponentProps<typeof BasePopover.Arrow>;
export const TRPopoverArrow = createComponentPart(
  BasePopover.Arrow,
  'tr-layer-arrow tr-popover-arrow',
);
