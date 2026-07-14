'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AlertDialogCloseProps = ComponentProps<typeof BaseAlertDialog.Close>;
export const AlertDialogClose = createComponentPart(
  BaseAlertDialog.Close,
  'tr-alert-dialog-close',
);
