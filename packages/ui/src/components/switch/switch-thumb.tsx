'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SwitchThumbProps = ComponentProps<typeof BaseSwitch.Thumb>;
export const SwitchThumb = createComponentPart(BaseSwitch.Thumb, 'tr-switch-thumb');
