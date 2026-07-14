'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuPositionerProps = ComponentProps<
  typeof BaseContextMenu.Positioner
>;
export const ContextMenuPositioner = createComponentPart(
  BaseContextMenu.Positioner,
  'tr-context-menu-positioner',
);
