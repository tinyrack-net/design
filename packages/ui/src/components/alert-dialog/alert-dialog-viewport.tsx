'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AlertDialogViewportProps = ComponentProps<typeof BaseAlertDialog.Viewport>;
export const AlertDialogViewport = createComponentPart(
  BaseAlertDialog.Viewport,
  'tr-alert-dialog-viewport',
);
