'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAlertDialogViewportProps = ComponentProps<
  typeof BaseAlertDialog.Viewport
>;
export const TRAlertDialogViewport = createComponentPart(
  BaseAlertDialog.Viewport,
  'tr-layer-viewport tr-alert-dialog-viewport',
);
