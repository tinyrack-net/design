'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DialogDescriptionProps = ComponentProps<typeof BaseDialog.Description>;
export const DialogDescription = createComponentPart(
  BaseDialog.Description,
  'tr-dialog-description',
);
