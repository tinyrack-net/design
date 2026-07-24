import type { ComponentPropsWithRef, ReactNode } from 'react';
import { TRAlert } from '@tinyrack/ui/components/alert';
import { mergeClassNames } from './utils/component-class-name.ts';

export type DocsCalloutVariant = 'caution' | 'danger' | 'note' | 'tip';
export type DocsCalloutProps = Omit<
  ComponentPropsWithRef<typeof TRAlert.Root>,
  'title' | 'variant'
> & {
  children: ReactNode;
  title?: ReactNode;
  variant?: DocsCalloutVariant;
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

export function DocsCallout({
  children,
  className,
  title,
  variant = 'note',
  ...props
}: DocsCalloutProps) {
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
