'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAlertDialogPopupProps = ComponentProps<typeof BaseAlertDialog.Popup>;
export const TRAlertDialogPopup = createComponentPart(
  BaseAlertDialog.Popup,
  'tr-alert-dialog-popup',
);
