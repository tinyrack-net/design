'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuArrowProps = ComponentProps<typeof BaseMenu.Arrow>;
export const TRMenuArrow = createComponentPart(
  BaseMenu.Arrow,
  'tr-layer-arrow tr-menu-arrow',
);
