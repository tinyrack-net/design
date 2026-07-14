'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerPopupProps = ComponentProps<typeof BaseDrawer.Popup>;
export const DrawerPopup = createComponentPart(BaseDrawer.Popup, 'tr-drawer-popup');
