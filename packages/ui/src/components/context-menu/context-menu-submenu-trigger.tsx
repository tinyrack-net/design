'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuSubmenuTriggerProps = ComponentProps<
  typeof BaseContextMenu.SubmenuTrigger
>;
export const ContextMenuSubmenuTrigger = createComponentPart(
  BaseContextMenu.SubmenuTrigger,
  'tr-context-menu-submenu-trigger',
);
