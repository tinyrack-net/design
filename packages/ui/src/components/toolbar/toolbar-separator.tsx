'use client';

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToolbarSeparatorProps = ComponentProps<typeof BaseToolbar.Separator>;
export const ToolbarSeparator = createComponentPart(
  BaseToolbar.Separator,
  'tr-toolbar-separator',
);
