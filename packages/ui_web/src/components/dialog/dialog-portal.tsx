'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRDialogPortalProps = ComponentProps<typeof BaseDialog.Portal>;
export const TRDialogPortal = createComponentPart(BaseDialog.Portal);
