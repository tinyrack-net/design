'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type InputProps = ComponentProps<typeof BaseInput>;
export const Input = createComponentPart(BaseInput, 'tr-input');
