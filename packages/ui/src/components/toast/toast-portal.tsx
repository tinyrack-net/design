'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps, ReactElement } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToastPortalProps = ComponentProps<typeof BaseToast.Portal>;
export const ToastPortal: (props: ToastPortalProps) => ReactElement | null =
  createComponentPart(BaseToast.Portal);
