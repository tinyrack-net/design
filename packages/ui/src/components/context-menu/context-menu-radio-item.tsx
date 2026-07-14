'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuRadioItemProps = ComponentProps<
  typeof BaseContextMenu.RadioItem
>;
export const ContextMenuRadioItem = createComponentPart(
  BaseContextMenu.RadioItem,
  'tr-context-menu-radio-item',
);
