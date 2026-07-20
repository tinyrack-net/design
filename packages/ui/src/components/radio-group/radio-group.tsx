'use client';

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRRadioGroupProps = ComponentProps<typeof BaseRadioGroup>;
export const TRRadioGroup = createComponentPart(BaseRadioGroup, 'tr-radio-group');
