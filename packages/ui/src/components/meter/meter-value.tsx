'use client';

import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRMeterValueProps = ComponentProps<typeof BaseMeter.Value>;
export const TRMeterValue = createComponentPart(BaseMeter.Value, 'tr-meter-value');
