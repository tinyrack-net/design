'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAlertDialogPortalProps = ComponentProps<typeof BaseAlertDialog.Portal>;
export const TRAlertDialogPortal = createComponentPart(
  BaseAlertDialog.Portal,
  'tr-alert-dialog-portal',
);
