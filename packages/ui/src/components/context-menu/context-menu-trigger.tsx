'use client';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ContextMenuTriggerProps = ComponentProps<typeof BaseContextMenu.Trigger>;
export const ContextMenuTrigger = createComponentPart(
  BaseContextMenu.Trigger,
  'tr-context-menu-trigger',
);
