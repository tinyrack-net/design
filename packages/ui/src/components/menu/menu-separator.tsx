'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuSeparatorProps = ComponentProps<typeof BaseMenu.Separator>;
export const TRMenuSeparator = createComponentPart(
  BaseMenu.Separator,
  'tr-menu-separator',
);
