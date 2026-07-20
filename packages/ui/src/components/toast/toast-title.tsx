'use client';

import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToastTitleProps = ComponentProps<typeof BaseToast.Title>;
export const TRToastTitle = createComponentPart(BaseToast.Title, 'tr-toast-title');
