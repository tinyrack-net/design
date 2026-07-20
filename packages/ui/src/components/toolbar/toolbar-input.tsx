'use client';

import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToolbarInputProps = ComponentProps<typeof BaseToolbar.Input>;
export const TRToolbarInput = createComponentPart(
  BaseToolbar.Input,
  'tr-toolbar-input',
);
