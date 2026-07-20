'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNavigationMenuRootProps = ComponentProps<typeof BaseNavigationMenu.Root>;
export const TRNavigationMenuRoot = createComponentPart(
  BaseNavigationMenu.Root,
  'tr-navigation-menu',
);
