import { type AnchorHTMLAttributes, forwardRef } from 'react';
import {
  type LinkUnderline,
  type LinkVariant,
  linkClassName,
  linkContract,
} from './contract.js';

export type { LinkUnderline, LinkVariant } from './contract.js';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  underline?: LinkUnderline;
  variant?: LinkVariant;
};

function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    className,
    underline = linkContract.defaultUnderline,
    variant = linkContract.defaultVariant,
    ...linkProps
  },
  ref,
) {
  return (
    <a
      {...linkProps}
      className={mergeClassNames(linkClassName, className)}
      data-underline={underline}
      data-variant={variant}
      ref={ref}
    />
  );
});
