'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentProps, ReactElement } from 'react';
import {
  type ComponentClassName,
  mergeComponentClassName,
} from '../../internal/component-class-name.js';

type BaseSelectPositionerProps = ComponentProps<typeof BaseSelect.Positioner>;

type TRSelectPositioningProp =
  | 'align'
  | 'alignItemWithTrigger'
  | 'alignOffset'
  | 'anchor'
  | 'arrowPadding'
  | 'collisionAvoidance'
  | 'collisionBoundary'
  | 'collisionPadding'
  | 'disableAnchorTracking'
  | 'positionMethod'
  | 'side'
  | 'sideOffset'
  | 'sticky';

const positioningProps = [
  'align',
  'alignItemWithTrigger',
  'alignOffset',
  'anchor',
  'arrowPadding',
  'collisionAvoidance',
  'collisionBoundary',
  'collisionPadding',
  'disableAnchorTracking',
  'positionMethod',
  'side',
  'sideOffset',
  'sticky',
] as const satisfies readonly TRSelectPositioningProp[];

export type TRSelectPositionerProps = Omit<
  BaseSelectPositionerProps,
  TRSelectPositioningProp
>;

export function TRSelectPositioner({
  className,
  ...props
}: TRSelectPositionerProps): ReactElement {
  const positionerProps = { ...props } as BaseSelectPositionerProps;
  for (const prop of positioningProps) {
    Reflect.deleteProperty(positionerProps, prop);
  }

  return (
    <BaseSelect.Positioner
      {...positionerProps}
      align="center"
      alignItemWithTrigger={false}
      className={mergeComponentClassName(
        'tr-layer-positioner tr-select-positioner',
        className as ComponentClassName,
      )}
      side="bottom"
      sideOffset={4}
    />
  );
}
