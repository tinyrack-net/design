'use client';

import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRToggleProps = ComponentProps<typeof BaseToggle>;
export const TRToggle = createComponentPart(BaseToggle, 'tr-toggle');
