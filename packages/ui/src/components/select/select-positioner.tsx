'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps, ReactElement } from 'react';
import {
  type ComponentClassName,
  mergeComponentClassName,
} from '../../internal/component-class-name.js';

export type SelectPositionerProps = ComponentProps<typeof BaseSelect.Positioner>;

export function SelectPositioner({
  alignItemWithTrigger = false,
  className,
  sideOffset = 4,
  ...positionerProps
}: SelectPositionerProps): ReactElement {
  return (
    <BaseSelect.Positioner
      {...positionerProps}
      alignItemWithTrigger={alignItemWithTrigger}
      className={mergeComponentClassName(
        'tr-select-positioner',
        className as ComponentClassName,
      )}
      sideOffset={sideOffset}
    />
  );
}
