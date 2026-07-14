'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuArrowProps = ComponentProps<typeof BaseContextMenu.Arrow>;
export const ContextMenuArrow = createComponentPart(
  BaseContextMenu.Arrow,
  'tr-context-menu-arrow',
);
