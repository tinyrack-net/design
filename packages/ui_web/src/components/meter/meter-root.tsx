'use client';

import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ComponentProps } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';

export type TRMeterVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type TRMeterRootProps = ComponentProps<typeof BaseMeter.Root> & {
  variant?: TRMeterVariant;
};

export function TRMeterRoot({
  className,
  max = 100,
  min = 0,
  value,
  variant = 'neutral',
  ...props
}: TRMeterRootProps) {
  const clampedValue = Math.min(max, Math.max(min, Number.isNaN(value) ? min : value));

  return (
    <BaseMeter.Root
      {...props}
      className={mergeComponentClassName('tr-meter', className)}
      data-variant={variant}
      max={max}
      min={min}
      value={clampedValue}
    />
  );
}
