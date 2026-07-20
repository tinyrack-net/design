'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRSwitchRootProps = ComponentProps<typeof BaseSwitch.Root>;
export const TRSwitchRoot = createComponentPart(BaseSwitch.Root, 'tr-switch');
