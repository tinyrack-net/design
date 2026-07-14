'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PopoverArrowProps = ComponentProps<typeof BasePopover.Arrow>;
export const PopoverArrow = createComponentPart(BasePopover.Arrow, 'tr-popover-arrow');
