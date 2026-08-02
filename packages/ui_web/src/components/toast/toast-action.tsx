'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToastActionProps = ComponentProps<typeof BaseToast.Action>;
export const TRToastAction = createComponentPart(BaseToast.Action, 'tr-toast-action');
