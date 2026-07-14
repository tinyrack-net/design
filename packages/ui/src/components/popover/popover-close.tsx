'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PopoverCloseProps = ComponentProps<typeof BasePopover.Close>;
export const PopoverClose = createComponentPart(BasePopover.Close, 'tr-popover-close');
