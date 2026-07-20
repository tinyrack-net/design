'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuPositionerProps = ComponentProps<typeof BaseMenu.Positioner>;
export const TRMenuPositioner = createComponentPart(
  BaseMenu.Positioner,
  'tr-layer-positioner tr-menu-positioner',
);
