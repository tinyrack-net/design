'use client';

import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToggleGroupProps = ComponentProps<typeof BaseToggleGroup>;
export const TRToggleGroup = createComponentPart(BaseToggleGroup, 'tr-toggle-group');
