'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectListProps = ComponentProps<typeof BaseSelect.List>;
export const TRSelectList = createComponentPart(BaseSelect.List, 'tr-select-list');
