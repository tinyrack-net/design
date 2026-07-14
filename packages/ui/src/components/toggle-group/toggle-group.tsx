'use client';

import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type ToggleGroupProps = ComponentProps<typeof BaseToggleGroup>;
export const ToggleGroup = createComponentPart(BaseToggleGroup, 'tr-toggle-group');
