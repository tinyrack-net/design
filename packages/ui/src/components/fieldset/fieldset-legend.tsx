'use client';

import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import type { ComponentProps } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type FieldsetLegendProps = ComponentProps<typeof BaseFieldset.Legend>;
export const FieldsetLegend = createComponentPart(
  BaseFieldset.Legend,
  'tr-fieldset-legend',
);
