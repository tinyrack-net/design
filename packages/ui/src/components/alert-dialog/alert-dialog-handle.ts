'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';

export function createAlertDialogHandle<Payload>() {
  return BaseAlertDialog.createHandle<Payload>();
}

export type AlertDialogHandle<Payload> = ReturnType<
  typeof createAlertDialogHandle<Payload>
>;
