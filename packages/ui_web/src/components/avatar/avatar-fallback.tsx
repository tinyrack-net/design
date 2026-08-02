'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAvatarFallbackProps = ComponentProps<typeof BaseAvatar.Fallback>;
export const TRAvatarFallback = createComponentPart(
  BaseAvatar.Fallback,
  'tr-avatar-fallback',
);
