'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRNavigationMenuViewportProps = ComponentProps<
  typeof BaseNavigationMenu.Viewport
>;
export const TRNavigationMenuViewport = createComponentPart(
  BaseNavigationMenu.Viewport,
  'tr-layer-viewport tr-navigation-menu-viewport',
);
