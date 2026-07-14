'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type RadioGroupProps = ComponentProps<typeof BaseRadioGroup>;
export const RadioGroup = createComponentPart(BaseRadioGroup, 'tr-radio-group');
