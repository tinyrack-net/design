'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAlertDialogBackdropProps = ComponentProps<
  typeof BaseAlertDialog.Backdrop
>;
export const TRAlertDialogBackdrop = createComponentPart(
  BaseAlertDialog.Backdrop,
  'tr-layer-backdrop tr-alert-dialog-backdrop',
);
