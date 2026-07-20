'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNavigationMenuPortalProps = ComponentProps<
  typeof BaseNavigationMenu.Portal
>;
export const TRNavigationMenuPortal = createComponentPart(
  BaseNavigationMenu.Portal,
  'tr-navigation-menu-portal',
);
