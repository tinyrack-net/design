'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuGroupLabelProps = ComponentProps<
  typeof BaseContextMenu.GroupLabel
>;
export const ContextMenuGroupLabel = createComponentPart(
  BaseContextMenu.GroupLabel,
  'tr-context-menu-group-label',
);
