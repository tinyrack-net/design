import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRSkeletonShape = 'text' | 'rectangle' | 'circle';
export type TRSkeletonProps = ComponentProps<'div'> & {
  animate?: boolean;
  shape?: TRSkeletonShape;
};

export function TRSkeleton({
  'aria-busy': ariaBusy,
  'aria-hidden': _ariaHidden,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-live': ariaLive,
  animate = true,
  className,
  role,
  shape = 'text',
  ...props
}: TRSkeletonProps) {
  const announced =
    role === 'status' ||
    (role == null && Boolean(ariaLabel || ariaLabelledby || ariaLive || ariaBusy));
  const skeletonProps = {
    ...props,
    className: mergeClassNames('tr-skeleton', className),
    'data-animate': animate,
    'data-shape': shape,
  };

  if (!announced) {
    return <div {...skeletonProps} aria-hidden="true" role={role} />;
  }

  return (
    <div
      {...skeletonProps}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-live={ariaLive ?? 'polite'}
      aria-busy={ariaBusy ?? 'true'}
      role="status"
    />
  );
}
