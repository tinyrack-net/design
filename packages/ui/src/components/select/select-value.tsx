'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectValueProps = ComponentProps<typeof BaseSelect.Value>;
export const SelectValue = createComponentPart(BaseSelect.Value, 'tr-select-value');
