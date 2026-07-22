'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ReactElement } from 'react';

export type TRPopoverRootProps<Payload = unknown> = BasePopover.Root.Props<Payload>;

export function TRPopoverRoot<Payload = unknown>(
  props: TRPopoverRootProps<Payload>,
): ReactElement {
  return <BasePopover.Root {...props} />;
}
