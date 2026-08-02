'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDialogDescriptionProps = ComponentProps<typeof BaseDialog.Description>;
export const TRDialogDescription = createComponentPart(
  BaseDialog.Description,
  'tr-dialog-description',
);
