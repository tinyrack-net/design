'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuRadioItemProps = ComponentProps<typeof BaseMenu.RadioItem>;
export const TRMenuRadioItem = createComponentPart(
  BaseMenu.RadioItem,
  'tr-menu-item tr-menu-radio-item',
);
