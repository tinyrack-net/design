'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuCheckboxItemProps = ComponentProps<
  typeof BaseContextMenu.CheckboxItem
>;
export const TRContextMenuCheckboxItem = createComponentPart(
  BaseContextMenu.CheckboxItem,
  'tr-context-menu-checkbox-item',
);
