'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectGroupProps = ComponentProps<typeof BaseSelect.Group>;
export const TRSelectGroup = createComponentPart(BaseSelect.Group, 'tr-select-group');
