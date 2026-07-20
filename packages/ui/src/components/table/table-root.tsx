import type { ComponentProps, Ref } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTableDensity = 'compact' | 'comfortable' | 'spacious';
export type TRTableRootProps = ComponentProps<'table'> & {
  containerClassName?: string;
  containerProps?: ComponentProps<'div'>;
  containerRef?: Ref<HTMLDivElement>;
  density?: TRTableDensity;
  striped?: boolean;
};

export function TRTableRoot({
  className,
  containerClassName,
  containerProps,
  containerRef,
  density = 'comfortable',
  striped = false,
  ...props
}: TRTableRootProps) {
  const {
    className: containerPropsClassName,
    ref: containerPropsRef,
    ...restContainerProps
  } = containerProps ?? {};

  return (
    <div
      {...restContainerProps}
      className={mergeClassNames(
        'tr-table-container',
        containerClassName,
        containerPropsClassName,
      )}
      ref={containerRef ?? containerPropsRef}
    >
      <table
        {...props}
        className={mergeClassNames('tr-table', className)}
        data-density={density}
        data-striped={striped ? 'true' : undefined}
      />
    </div>
  );
}
