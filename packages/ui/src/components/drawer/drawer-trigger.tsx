'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerTriggerProps = ComponentProps<typeof BaseDrawer.Trigger>;
export const DrawerTrigger = createComponentPart(
  BaseDrawer.Trigger,
  'tr-drawer-trigger',
);
