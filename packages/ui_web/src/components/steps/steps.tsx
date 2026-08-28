import type { ComponentPropsWithRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRStepsRootProps = ComponentPropsWithRef<'ol'>;
export type TRStepsItemProps = ComponentPropsWithRef<'li'>;
export type TRStepsProgressProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  current: number;
  total: number;
};

export function TRStepsRoot({ className, role = 'list', ...props }: TRStepsRootProps) {
  return (
    <ol {...props} className={mergeClassNames('tr-steps', className)} role={role} />
  );
}

export function TRStepsItem({ className, ...props }: TRStepsItemProps) {
  return <li {...props} className={mergeClassNames('tr-steps-item', className)} />;
}

export function TRStepsProgress({
  className,
  current,
  total,
  ...props
}: TRStepsProgressProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(1, current), safeTotal);
  return (
    <div
      {...props}
      aria-valuemax={safeTotal}
      aria-valuemin={1}
      aria-valuenow={safeCurrent}
      className={mergeClassNames('tr-steps-progress', className)}
      role="progressbar"
    >
      {Array.from({ length: safeTotal }, (_, index) => String(index + 1)).map(
        (step) => (
          <span
            aria-hidden="true"
            className="tr-steps-progress-segment"
            data-complete={Number(step) <= safeCurrent ? 'true' : undefined}
            key={step}
          />
        ),
      )}
    </div>
  );
}
