'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAlertDialogDescriptionProps = ComponentProps<
  typeof BaseAlertDialog.Description
>;
export const TRAlertDialogDescription = createComponentPart(
  BaseAlertDialog.Description,
  'tr-alert-dialog-description',
);
