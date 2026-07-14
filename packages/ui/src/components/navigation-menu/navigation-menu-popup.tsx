'use client';

import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type NavigationMenuPopupProps = ComponentProps<typeof BaseNavigationMenu.Popup>;
export const NavigationMenuPopup = createComponentPart(
  BaseNavigationMenu.Popup,
  'tr-navigation-menu-popup',
);
