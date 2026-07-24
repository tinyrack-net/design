import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRLink } from '../link/index.js';

export type TRBreadcrumbsItem = {
  href?: string;
  label: string;
};

export type TRBreadcrumbsProps = Omit<ComponentPropsWithRef<'nav'>, 'children'> & {
  items: readonly TRBreadcrumbsItem[];
  label?: string;
  renderLink?: (item: TRBreadcrumbsItem, index: number) => ReactElement;
  separator?: ReactNode;
};

export function TRBreadcrumbs({
  className,
  items,
  label = 'Breadcrumb',
  ref,
  renderLink,
  separator = '/',
  ...props
}: TRBreadcrumbsProps) {
  if (items.length === 0) return null;
  const lastIndex = items.length - 1;

  return (
    <nav
      {...props}
      aria-label={label}
      className={mergeClassNames('tr-breadcrumbs', className)}
      ref={ref}
    >
      <ol className="tr-breadcrumbs-list">
        {items.map((item, index) => {
          const current = index === lastIndex;
          return (
            <li className="tr-breadcrumbs-item" key={item.href ?? item.label}>
              {item.href === undefined ? (
                <span
                  aria-current={current ? 'page' : undefined}
                  className="tr-breadcrumbs-current"
                >
                  {item.label}
                </span>
              ) : (
                <TRLink
                  className="tr-breadcrumbs-link"
                  href={item.href}
                  render={renderLink?.(item, index)}
                  underline="hover"
                >
                  {item.label}
                </TRLink>
              )}
              {current ? null : (
                <span aria-hidden="true" className="tr-breadcrumbs-separator">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
