import type { ComponentPropsWithRef, ReactNode } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRAlert } from '../alert/index.js';

export type TRCalloutVariant = 'caution' | 'danger' | 'note' | 'tip';
export type TRCalloutProps = Omit<
  ComponentPropsWithRef<typeof TRAlert.Root>,
  'title' | 'variant'
> & {
  children: ReactNode;
  title?: ReactNode;
  variant?: TRCalloutVariant;
};

const alertVariants = {
  caution: 'warning',
  danger: 'danger',
  note: 'info',
  tip: 'success',
} as const;

const defaultTitles = {
  caution: 'Caution',
  danger: 'Danger',
  note: 'Note',
  tip: 'Tip',
} as const;

export function TRCallout({
  children,
  className,
  title,
  variant = 'note',
  ...props
}: TRCalloutProps) {
  return (
    <TRAlert.Root
      {...props}
      className={mergeClassNames('tr-callout', className)}
      variant={alertVariants[variant]}
    >
      <TRAlert.Title>{title ?? defaultTitles[variant]}</TRAlert.Title>
      <TRAlert.Description render={<div />}>{children}</TRAlert.Description>
    </TRAlert.Root>
  );
}
