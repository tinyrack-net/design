'use client';

import { Form as BaseForm } from '@base-ui/react/form';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type FormProps = ComponentProps<typeof BaseForm>;
export const Form = createComponentPart(BaseForm, 'tr-form');
