'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuPopupProps = ComponentProps<typeof BaseMenu.Popup>;
export const MenuPopup = createComponentPart(
  BaseMenu.Popup,
  'tr-layer tr-menu-content',
);
