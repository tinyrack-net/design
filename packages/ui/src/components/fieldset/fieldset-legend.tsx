'use client';

import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRFieldsetLegendProps = ComponentProps<typeof BaseFieldset.Legend>;
export const TRFieldsetLegend = createComponentPart(
  BaseFieldset.Legend,
  'tr-fieldset-legend',
);
