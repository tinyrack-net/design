'use client';

import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MeterLabelProps = ComponentProps<typeof BaseMeter.Label>;
export const MeterLabel = createComponentPart(BaseMeter.Label, 'tr-meter-label');
