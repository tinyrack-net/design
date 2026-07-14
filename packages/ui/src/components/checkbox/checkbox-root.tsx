'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type CheckboxRootProps = ComponentProps<typeof BaseCheckbox.Root>;
export const CheckboxRoot = createComponentPart(BaseCheckbox.Root, 'tr-checkbox');
