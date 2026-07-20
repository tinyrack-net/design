'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDrawerRootProps = ComponentProps<typeof BaseDrawer.Root>;
export const TRDrawerRoot = createComponentPart(BaseDrawer.Root, 'tr-drawer');
