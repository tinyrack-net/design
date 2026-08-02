'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDialogViewportProps = ComponentProps<typeof BaseDialog.Viewport>;
export const TRDialogViewport = createComponentPart(
  BaseDialog.Viewport,
  'tr-layer-viewport tr-dialog-viewport',
);
