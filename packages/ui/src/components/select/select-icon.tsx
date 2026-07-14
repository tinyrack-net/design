'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectIconProps = ComponentProps<typeof BaseSelect.Icon>;
export const SelectIcon = createComponentPart(BaseSelect.Icon, 'tr-select-icon');
