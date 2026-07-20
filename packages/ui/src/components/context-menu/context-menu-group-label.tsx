'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRContextMenuGroupLabelProps = ComponentProps<
  typeof BaseContextMenu.GroupLabel
>;
export const TRContextMenuGroupLabel = createComponentPart(
  BaseContextMenu.GroupLabel,
  'tr-context-menu-group-label',
);
