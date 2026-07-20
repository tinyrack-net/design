'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAlertDialogTriggerProps = ComponentProps<typeof BaseAlertDialog.Trigger>;
export const TRAlertDialogTrigger = createComponentPart(
  BaseAlertDialog.Trigger,
  'tr-alert-dialog-trigger',
);
