'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerContentProps = ComponentProps<typeof BaseDrawer.Content>;
export const DrawerContent = createComponentPart(
  BaseDrawer.Content,
  'tr-drawer-content',
);
