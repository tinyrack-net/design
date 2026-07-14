'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DialogViewportProps = ComponentProps<typeof BaseDialog.Viewport>;
export const DialogViewport = createComponentPart(
  BaseDialog.Viewport,
  'tr-dialog-viewport',
);
