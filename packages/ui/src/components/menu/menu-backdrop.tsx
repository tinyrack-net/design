'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuBackdropProps = ComponentProps<typeof BaseMenu.Backdrop>;
export const TRMenuBackdrop = createComponentPart(
  BaseMenu.Backdrop,
  'tr-layer-backdrop tr-menu-backdrop',
);
