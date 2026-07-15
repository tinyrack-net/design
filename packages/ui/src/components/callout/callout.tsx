import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Alert } from '../alert/index.js';

export type CalloutVariant = 'caution' | 'danger' | 'note' | 'tip';
export type CalloutProps = Omit<
  ComponentPropsWithRef<typeof Alert.Root>,
  'title' | 'variant'
> & {
  children: ReactNode;
  title?: ReactNode;
  variant?: CalloutVariant;
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

export function Callout({ children, title, variant = 'note', ...props }: CalloutProps) {
  return (
    <Alert.Root {...props} className="tr-callout" variant={alertVariants[variant]}>
      <Alert.Title>{title ?? defaultTitles[variant]}</Alert.Title>
      <Alert.Description render={<div />}>{children}</Alert.Description>
    </Alert.Root>
  );
}
