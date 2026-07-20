'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDrawerViewportProps = ComponentProps<typeof BaseDrawer.Viewport>;
export const TRDrawerViewport = createComponentPart(
  BaseDrawer.Viewport,
  'tr-layer-viewport tr-drawer-viewport',
);
