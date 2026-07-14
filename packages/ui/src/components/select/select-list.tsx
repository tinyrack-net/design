'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectListProps = ComponentProps<typeof BaseSelect.List>;
export const SelectList = createComponentPart(BaseSelect.List, 'tr-select-list');
