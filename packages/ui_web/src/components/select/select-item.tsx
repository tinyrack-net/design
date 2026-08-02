'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectItemProps = ComponentProps<typeof BaseSelect.Item>;
export const TRSelectItem = createComponentPart(BaseSelect.Item, 'tr-select-item');
