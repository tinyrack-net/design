'use client';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMenuViewportProps = ComponentProps<typeof BaseMenu.Viewport>;
export const TRMenuViewport = createComponentPart(
  BaseMenu.Viewport,
  'tr-layer-viewport tr-menu-viewport',
);
