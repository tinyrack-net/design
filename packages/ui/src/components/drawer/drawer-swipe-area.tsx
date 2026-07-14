'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerSwipeAreaProps = ComponentProps<typeof BaseDrawer.SwipeArea>;
export const DrawerSwipeArea = createComponentPart(
  BaseDrawer.SwipeArea,
  'tr-drawer-swipe-area',
);
