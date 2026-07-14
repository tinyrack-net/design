'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectItemProps = ComponentProps<typeof BaseSelect.Item>;
export const SelectItem = createComponentPart(BaseSelect.Item, 'tr-select-item');
