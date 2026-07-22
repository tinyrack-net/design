'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRPopoverPopupProps = ComponentProps<typeof BasePopover.Popup>;
export const TRPopoverPopup = createComponentPart(
  BasePopover.Popup,
  'tr-layer tr-popover-popup',
);
