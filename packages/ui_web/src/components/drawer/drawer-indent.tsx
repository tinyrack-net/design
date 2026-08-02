'use client';

import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDrawerIndentProps = ComponentProps<typeof BaseDrawer.Indent>;
export const TRDrawerIndent = createComponentPart(
  BaseDrawer.Indent,
  'tr-drawer-indent',
);
