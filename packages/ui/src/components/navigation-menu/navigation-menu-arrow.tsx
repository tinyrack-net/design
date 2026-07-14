'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NavigationMenuArrowProps = ComponentProps<typeof BaseNavigationMenu.Arrow>;
export const NavigationMenuArrow = createComponentPart(
  BaseNavigationMenu.Arrow,
  'tr-navigation-menu-arrow',
);
