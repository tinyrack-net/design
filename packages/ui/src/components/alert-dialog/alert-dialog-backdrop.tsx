'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AlertDialogBackdropProps = ComponentProps<typeof BaseAlertDialog.Backdrop>;
export const AlertDialogBackdrop = createComponentPart(
  BaseAlertDialog.Backdrop,
  'tr-alert-dialog-backdrop',
);
