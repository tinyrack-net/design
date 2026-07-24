'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRLink, type TRLinkProps } from '../link/index.js';

export type TRBrandProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  href?: string;
  linkClassName?: string;
  linkProps?: Omit<
    TRLinkProps,
    'children' | 'className' | 'href' | 'render' | 'underline'
  >;
  logo: ReactNode;
  render?: TRLinkProps['render'];
  title?: ReactNode;
  titleClassName?: string;
};

/**
 * Brand lockup: a linked logo followed by an optional title and any trailing
 * content (typically a version badge). The link accepts a `render` element so
 * consumers can drop in a router link, or a plain `href`.
 */
export function TRBrand({
  children,
  className,
  href,
  linkClassName,
  linkProps,
  logo,
  render,
  title,
  titleClassName,
  ...props
}: TRBrandProps) {
  return (
    <div {...props} className={mergeClassNames('tr-brand', className)}>
      <TRLink
        {...linkProps}
        className={mergeClassNames('tr-brand-link', linkClassName)}
        href={href}
        render={render}
        underline="none"
      >
        {logo}
      </TRLink>
      {title == null ? null : (
        <span className={mergeClassNames('tr-brand-title', titleClassName)}>
          {title}
        </span>
      )}
      {children}
    </div>
  );
}
