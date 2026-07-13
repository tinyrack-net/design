import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type SkeletonShape = 'text' | 'rectangle' | 'circle';
export type SkeletonProps = ComponentProps<'div'> & {
  animate?: boolean;
  shape?: SkeletonShape;
};

export function Skeleton({
  'aria-label': ariaLabel,
  animate = true,
  className,
  shape = 'text',
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      aria-label={ariaLabel}
      aria-live={ariaLabel ? 'polite' : undefined}
      aria-busy={ariaLabel ? 'true' : undefined}
      className={mergeClassNames('tr-skeleton', className)}
      data-animate={animate}
      data-shape={shape}
      role="status"
    />
  );
}
