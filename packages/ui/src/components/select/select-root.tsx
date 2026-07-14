'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SelectRootProps = ComponentProps<typeof BaseSelect.Root>;
export const SelectRoot = createComponentPart(BaseSelect.Root, 'tr-select');
