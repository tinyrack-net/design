'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPopoverPortalProps = ComponentProps<typeof BasePopover.Portal>;
export const TRPopoverPortal = createComponentPart(BasePopover.Portal);
