'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerTitleProps = ComponentProps<typeof BaseDrawer.Title>;
export const DrawerTitle = createComponentPart(BaseDrawer.Title, 'tr-drawer-title');
