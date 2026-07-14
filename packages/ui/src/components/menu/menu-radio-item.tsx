'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MenuRadioItemProps = ComponentProps<typeof BaseMenu.RadioItem>;
export const MenuRadioItem = createComponentPart(
  BaseMenu.RadioItem,
  'tr-menu-item tr-menu-radio-item',
);
