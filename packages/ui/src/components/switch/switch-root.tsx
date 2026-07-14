'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type SwitchRootProps = ComponentProps<typeof BaseSwitch.Root>;
export const SwitchRoot = createComponentPart(BaseSwitch.Root, 'tr-switch');
