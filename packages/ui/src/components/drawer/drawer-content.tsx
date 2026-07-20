'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDrawerContentProps = ComponentProps<typeof BaseDrawer.Content>;
export const TRDrawerContent = createComponentPart(
  BaseDrawer.Content,
  'tr-drawer-content',
);
