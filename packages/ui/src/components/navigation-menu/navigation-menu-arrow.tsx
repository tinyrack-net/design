'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNavigationMenuArrowProps = ComponentProps<
  typeof BaseNavigationMenu.Arrow
>;
export const TRNavigationMenuArrow = createComponentPart(
  BaseNavigationMenu.Arrow,
  'tr-layer-arrow tr-navigation-menu-arrow',
);
