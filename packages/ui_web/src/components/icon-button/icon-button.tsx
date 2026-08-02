'use client';

import type { ReactNode } from 'react';
import { mergeComponentClassName } from '../../internal/component-class-name.js';
import { TRButton, type TRButtonProps } from '../button/index.js';

type IconButtonAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type TRIconButtonProps = Omit<
  TRButtonProps,
  'aria-label' | 'aria-labelledby' | 'children'
> &
  IconButtonAccessibleName & {
    children: ReactNode;
  };

export function TRIconButton({
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  loading,
  ...props
}: TRIconButtonProps) {
  return (
    <TRButton
      {...props}
      {...((!loading || props.loadingLabel === undefined) && ariaLabelledBy
        ? { 'aria-labelledby': ariaLabelledBy }
        : {})}
      {...(loading === undefined ? {} : { loading })}
      className={mergeComponentClassName('tr-icon-btn', className)}
    >
      {loading ? null : children}
    </TRButton>
  );
}
