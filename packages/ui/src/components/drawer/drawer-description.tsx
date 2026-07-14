'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerDescriptionProps = ComponentProps<typeof BaseDrawer.Description>;
export const DrawerDescription = createComponentPart(
  BaseDrawer.Description,
  'tr-drawer-description',
);
