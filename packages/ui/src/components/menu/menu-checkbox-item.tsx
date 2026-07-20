'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuCheckboxItemProps = ComponentProps<typeof BaseMenu.CheckboxItem>;
export const TRMenuCheckboxItem = createComponentPart(
  BaseMenu.CheckboxItem,
  'tr-menu-item tr-menu-checkbox-item',
);
