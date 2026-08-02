'use client';

import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import type { ComponentProps, Ref } from 'react';
import { createComponentPart } from '../../internal/component-part.js';

export type TRFieldsetLegendProps = Omit<
  ComponentProps<typeof BaseFieldset.Legend>,
  'ref'
> & {
  ref?: Ref<HTMLLegendElement>;
};

function FieldsetLegend({ ref, render = <legend />, ...props }: TRFieldsetLegendProps) {
  return (
    <BaseFieldset.Legend {...props} ref={ref as Ref<HTMLDivElement>} render={render} />
  );
}

export const TRFieldsetLegend = createComponentPart(
  FieldsetLegend,
  'tr-fieldset-legend',
);
