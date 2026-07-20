'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectIconProps = ComponentProps<typeof BaseSelect.Icon>;
export const TRSelectIcon = createComponentPart(BaseSelect.Icon, 'tr-select-icon');
