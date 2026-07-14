'use client';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type AvatarImageProps = ComponentProps<typeof BaseAvatar.Image>;
export const AvatarImage = createComponentPart(BaseAvatar.Image, 'tr-avatar-image');
