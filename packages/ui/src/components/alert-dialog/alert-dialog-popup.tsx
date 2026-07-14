'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AlertDialogPopupProps = ComponentProps<typeof BaseAlertDialog.Popup>;
export const AlertDialogPopup = createComponentPart(
  BaseAlertDialog.Popup,
  'tr-alert-dialog-popup',
);
