'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuArrowProps = ComponentProps<typeof BaseContextMenu.Arrow>;
export const TRContextMenuArrow = createComponentPart(
  BaseContextMenu.Arrow,
  'tr-layer-arrow tr-context-menu-arrow',
);
