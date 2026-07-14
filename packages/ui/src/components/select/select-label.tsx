'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectLabelProps = ComponentProps<typeof BaseSelect.Label>;
export const SelectLabel = createComponentPart(BaseSelect.Label, 'tr-select-label');
