'use client';

import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type MeterValueProps = ComponentProps<typeof BaseMeter.Value>;
export const MeterValue = createComponentPart(BaseMeter.Value, 'tr-meter-value');
