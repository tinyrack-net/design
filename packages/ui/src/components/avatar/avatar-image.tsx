'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRAvatarImageProps = ComponentProps<typeof BaseAvatar.Image>;
export const TRAvatarImage = createComponentPart(BaseAvatar.Image, 'tr-avatar-image');
