'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuRadioItemIndicatorProps = ComponentProps<
  typeof BaseContextMenu.RadioItemIndicator
>;
export const TRContextMenuRadioItemIndicator = createComponentPart(
  BaseContextMenu.RadioItemIndicator,
  'tr-context-menu-radio-item-indicator',
);
