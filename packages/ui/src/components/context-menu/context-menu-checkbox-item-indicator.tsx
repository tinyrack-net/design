'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuCheckboxItemIndicatorProps = ComponentProps<
  typeof BaseContextMenu.CheckboxItemIndicator
>;
export const TRContextMenuCheckboxItemIndicator = createComponentPart(
  BaseContextMenu.CheckboxItemIndicator,
  'tr-context-menu-checkbox-item-indicator',
);
