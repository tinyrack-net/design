'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuPositionerProps = ComponentProps<typeof BaseMenu.Positioner>;
export const MenuPositioner = createComponentPart(
  BaseMenu.Positioner,
  'tr-menu-positioner',
);
