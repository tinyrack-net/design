'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAlertDialogCloseProps = ComponentProps<typeof BaseAlertDialog.Close>;
export const TRAlertDialogClose = createComponentPart(
  BaseAlertDialog.Close,
  'tr-alert-dialog-close',
);
