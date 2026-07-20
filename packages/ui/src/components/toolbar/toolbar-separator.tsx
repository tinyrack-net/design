'use client';

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToolbarSeparatorProps = ComponentProps<typeof BaseToolbar.Separator>;
export const TRToolbarSeparator = createComponentPart(
  BaseToolbar.Separator,
  'tr-toolbar-separator',
);
