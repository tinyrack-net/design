'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDialogTriggerProps = ComponentProps<typeof BaseDialog.Trigger>;
export const TRDialogTrigger = createComponentPart(
  BaseDialog.Trigger,
  'tr-dialog-trigger',
);
