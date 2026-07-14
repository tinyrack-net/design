'use client';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type DialogPortalProps = ComponentProps<typeof BaseDialog.Portal>;
export const DialogPortal = createComponentPart(BaseDialog.Portal);
