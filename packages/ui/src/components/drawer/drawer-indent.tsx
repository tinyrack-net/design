'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DrawerIndentProps = ComponentProps<typeof BaseDrawer.Indent>;
export const DrawerIndent = createComponentPart(BaseDrawer.Indent, 'tr-drawer-indent');
