'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type PopoverPortalProps = ComponentProps<typeof BasePopover.Portal>;
export const PopoverPortal = createComponentPart(BasePopover.Portal);
