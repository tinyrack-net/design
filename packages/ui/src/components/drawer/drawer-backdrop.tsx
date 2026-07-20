'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDrawerBackdropProps = ComponentProps<typeof BaseDrawer.Backdrop>;
export const TRDrawerBackdrop = createComponentPart(
  BaseDrawer.Backdrop,
  'tr-layer-backdrop tr-drawer-backdrop',
);
