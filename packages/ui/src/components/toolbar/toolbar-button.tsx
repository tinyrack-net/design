'use client';

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToolbarButtonProps = ComponentProps<typeof BaseToolbar.Button>;
export const ToolbarButton = createComponentPart(
  BaseToolbar.Button,
  'tr-toolbar-button',
);
