'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSelectPortalProps = ComponentProps<typeof BaseSelect.Portal>;
export const TRSelectPortal = createComponentPart(
  BaseSelect.Portal,
  'tr-select-portal',
);
