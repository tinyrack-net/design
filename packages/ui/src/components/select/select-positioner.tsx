'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps, ReactElement } from 'react';
import {
  type ComponentClassName,
  mergeComponentClassName,
} from '../../internal/component-class-name.js';

export type TRSelectPositionerProps = ComponentProps<typeof BaseSelect.Positioner>;

export function TRSelectPositioner({
  alignItemWithTrigger = false,
  className,
  sideOffset = 4,
  ...positionerProps
}: TRSelectPositionerProps): ReactElement {
  return (
    <BaseSelect.Positioner
      {...positionerProps}
      alignItemWithTrigger={alignItemWithTrigger}
      className={mergeComponentClassName(
        'tr-layer-positioner tr-select-positioner',
        className as ComponentClassName,
      )}
      sideOffset={sideOffset}
    />
  );
}
