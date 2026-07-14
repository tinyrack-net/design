'use client';

import { Radio as BaseRadio } from '@base-ui/react/radio';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type RadioRootProps = ComponentProps<typeof BaseRadio.Root>;
export const RadioRoot = createComponentPart(BaseRadio.Root, 'tr-radio');
