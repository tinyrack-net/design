'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuGroupLabelProps = ComponentProps<typeof BaseMenu.GroupLabel>;
export const TRMenuGroupLabel = createComponentPart(
  BaseMenu.GroupLabel,
  'tr-menu-label tr-menu-group-label',
);
