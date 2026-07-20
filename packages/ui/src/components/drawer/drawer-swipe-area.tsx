'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDrawerSwipeAreaProps = ComponentProps<typeof BaseDrawer.SwipeArea>;
export const TRDrawerSwipeArea = createComponentPart(
  BaseDrawer.SwipeArea,
  'tr-drawer-swipe-area',
);
