'use client';

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToolbarButtonProps = ComponentProps<typeof BaseToolbar.Button>;
export const TRToolbarButton = createComponentPart(
  BaseToolbar.Button,
  'tr-toolbar-button',
);
