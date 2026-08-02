'use client';

import type { DialogRootProps } from '@base-ui/react/dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';

export type TRDialogRootProps<Payload = unknown> = DialogRootProps<Payload>;

export function TRDialogRoot<Payload = unknown>(props: TRDialogRootProps<Payload>) {
  return <BaseDialog.Root {...props} />;
}
