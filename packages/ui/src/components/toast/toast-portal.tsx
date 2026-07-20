'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps, ReactElement } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToastPortalProps = ComponentProps<typeof BaseToast.Portal>;
export const TRToastPortal: (props: TRToastPortalProps) => ReactElement | null =
  createComponentPart(BaseToast.Portal);
