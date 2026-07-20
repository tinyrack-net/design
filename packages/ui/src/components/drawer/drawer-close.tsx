'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDrawerCloseProps = ComponentProps<typeof BaseDrawer.Close>;
export const TRDrawerClose = createComponentPart(BaseDrawer.Close, 'tr-drawer-close');
