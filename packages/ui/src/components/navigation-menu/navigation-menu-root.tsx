'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NavigationMenuRootProps = ComponentProps<typeof BaseNavigationMenu.Root>;
export const NavigationMenuRoot = createComponentPart(
  BaseNavigationMenu.Root,
  'tr-navigation-menu',
);
