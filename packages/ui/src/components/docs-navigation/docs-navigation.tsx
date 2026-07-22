'use client';

import {
  type ComponentPropsWithRef,
  type ReactElement,
  useEffect,
  useState,
} from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRCollapsible } from '../collapsible/index.js';
import { TRLink } from '../link/index.js';
import { TRSpinner } from '../spinner/index.js';

export type TRDocsNavigationPage = {
  external?: false;
  label: string;
  path: string;
  type: 'page';
};

export type TRDocsNavigationLink = {
  external?: boolean;
  label: string;
  path: string;
  type: 'link';
};

export type TRDocsNavigationGroup = {
  children: readonly TRDocsNavigationItem[];
  label: string;
  type: 'group';
};

export type TRDocsNavigationItem =
  | TRDocsNavigationGroup
  | TRDocsNavigationLink
  | TRDocsNavigationPage;

export type TRDocsNavigationLinkState = {
  active: boolean;
  pending: boolean;
};

export type TRDocsNavigationProps = Omit<
  ComponentPropsWithRef<'nav'>,
  'aria-label' | 'children'
> & {
  currentPath: string;
  defaultGroupsOpen?: boolean;
  items: readonly TRDocsNavigationItem[];
  label?: string;
  onNavigate?: (item: TRDocsNavigationLink | TRDocsNavigationPage) => void;
  pendingPath?: string;
  renderLink?: (
    item: TRDocsNavigationLink | TRDocsNavigationPage,
    state: TRDocsNavigationLinkState,
  ) => ReactElement;
};

function groupContainsPath(group: TRDocsNavigationGroup, path: string): boolean {
  return group.children.some((item) =>
    item.type === 'group' ? groupContainsPath(item, path) : item.path === path,
  );
}

function NavigationGroup({
  currentPath,
  defaultGroupsOpen,
  item,
  onNavigate,
  pendingPath,
  renderLink,
}: {
  currentPath: string;
  defaultGroupsOpen: boolean;
  item: TRDocsNavigationGroup;
  onNavigate: TRDocsNavigationProps['onNavigate'] | undefined;
  pendingPath: string | undefined;
  renderLink: TRDocsNavigationProps['renderLink'] | undefined;
}) {
  const containsRoute =
    groupContainsPath(item, currentPath) ||
    (pendingPath !== undefined && groupContainsPath(item, pendingPath));
  const matchedRoute = containsRoute
    ? `${currentPath}\0${pendingPath ?? ''}`
    : undefined;
  const [open, setOpen] = useState(defaultGroupsOpen || containsRoute);

  useEffect(() => {
    if (matchedRoute !== undefined) setOpen(true);
  }, [matchedRoute]);

  return (
    <li className="tr-docs-navigation-group">
      <TRCollapsible.Root onOpenChange={setOpen} open={open}>
        <TRCollapsible.Trigger className="tr-docs-navigation-group-trigger">
          <span>{item.label}</span>
          <svg
            aria-hidden="true"
            className="tr-docs-navigation-chevron"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </TRCollapsible.Trigger>
        <TRCollapsible.Panel className="tr-docs-navigation-group-panel">
          <NavigationItems
            currentPath={currentPath}
            defaultGroupsOpen={defaultGroupsOpen}
            items={item.children}
            onNavigate={onNavigate}
            pendingPath={pendingPath}
            renderLink={renderLink}
          />
        </TRCollapsible.Panel>
      </TRCollapsible.Root>
    </li>
  );
}

function NavigationItems({
  currentPath,
  defaultGroupsOpen,
  items,
  onNavigate,
  pendingPath,
  renderLink,
}: {
  currentPath: string;
  defaultGroupsOpen: boolean;
  items: readonly TRDocsNavigationItem[];
  onNavigate: TRDocsNavigationProps['onNavigate'] | undefined;
  pendingPath: string | undefined;
  renderLink: TRDocsNavigationProps['renderLink'] | undefined;
}) {
  return (
    <ul className="tr-docs-navigation-list">
      {items.map((item) => {
        if (item.type === 'group') {
          return (
            <NavigationGroup
              currentPath={currentPath}
              defaultGroupsOpen={defaultGroupsOpen}
              item={item}
              key={item.label}
              onNavigate={onNavigate}
              pendingPath={pendingPath}
              renderLink={renderLink}
            />
          );
        }
        const state = {
          active: item.path === currentPath,
          pending: item.path !== currentPath && item.path === pendingPath,
        };
        return (
          <li key={item.path}>
            <TRLink
              aria-current={state.active ? 'page' : undefined}
              className="tr-docs-navigation-link"
              data-active={state.active || undefined}
              data-pending={state.pending || undefined}
              href={item.path}
              onClick={() => onNavigate?.(item)}
              render={renderLink?.(item, state)}
              underline="none"
            >
              <span>{item.label}</span>
              {state.pending ? (
                <TRSpinner decorative uiSize="sm" variant="primary" />
              ) : null}
            </TRLink>
          </li>
        );
      })}
    </ul>
  );
}

export function TRDocsNavigation({
  className,
  currentPath,
  defaultGroupsOpen = false,
  items,
  label = 'Documentation',
  onNavigate,
  pendingPath,
  ref,
  renderLink,
  ...props
}: TRDocsNavigationProps) {
  return (
    <nav
      {...props}
      aria-label={label}
      className={mergeClassNames('tr-docs-navigation', className)}
      ref={ref}
    >
      <NavigationItems
        currentPath={currentPath}
        defaultGroupsOpen={defaultGroupsOpen}
        items={items}
        onNavigate={onNavigate}
        pendingPath={pendingPath}
        renderLink={renderLink}
      />
    </nav>
  );
}
