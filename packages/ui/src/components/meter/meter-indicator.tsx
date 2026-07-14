'use client';

import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MeterIndicatorProps = ComponentProps<typeof BaseMeter.Indicator>;
export const MeterIndicator = createComponentPart(
  BaseMeter.Indicator,
  'tr-meter-indicator',
);
