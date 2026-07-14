'use client';

import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MeterRootProps = ComponentProps<typeof BaseMeter.Root>;
export const MeterRoot = createComponentPart(BaseMeter.Root, 'tr-meter');
