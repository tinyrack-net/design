import type { ComponentProps } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type LinkUnderline = 'always' | 'hover' | 'none';
export type LinkVariant = 'default' | 'muted' | 'primary' | 'danger';
export type LinkProps = ComponentProps<'a'> & {
  underline?: LinkUnderline;
  variant?: LinkVariant;
};

export function Link({
  className,
  underline = 'hover',
  variant = 'default',
  ...props
}: LinkProps) {
  return (
    <a
      {...props}
      className={mergeClassNames('tr-link', className)}
      data-underline={underline}
      data-variant={variant}
    />
  );
}
