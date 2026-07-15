'use client';

import type { ReactElement, Ref } from 'react';
import { Collapsible } from '../collapsible/index.js';
import { Link } from '../link/index.js';
import { Spinner } from '../spinner/index.js';

export type DocsNavigationPage = {
  external?: false;
  label: string;
  path: string;
  type: 'page';
};

export type DocsNavigationLink = {
  external?: boolean;
  label: string;
  path: string;
  type: 'link';
};

export type DocsNavigationGroup = {
  children: readonly DocsNavigationItem[];
  label: string;
  type: 'group';
};

export type DocsNavigationItem =
  | DocsNavigationGroup
  | DocsNavigationLink
  | DocsNavigationPage;

export type DocsNavigationLinkState = {
  active: boolean;
  pending: boolean;
};

export type DocsNavigationProps = {
  currentPath: string;
  defaultGroupsOpen?: boolean;
  items: readonly DocsNavigationItem[];
  label?: string;
  onNavigate?: (item: DocsNavigationLink | DocsNavigationPage) => void;
  pendingPath?: string;
  ref?: Ref<HTMLElement>;
  renderLink?: (
    item: DocsNavigationLink | DocsNavigationPage,
    state: DocsNavigationLinkState,
  ) => ReactElement;
};

function groupContainsPath(group: DocsNavigationGroup, path: string): boolean {
  return group.children.some((item) =>
    item.type === 'group' ? groupContainsPath(item, path) : item.path === path,
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
  items: readonly DocsNavigationItem[];
  onNavigate: DocsNavigationProps['onNavigate'] | undefined;
  pendingPath: string | undefined;
  renderLink: DocsNavigationProps['renderLink'] | undefined;
}) {
  return (
    <ul className="tr-docs-navigation-list">
      {items.map((item) => {
        if (item.type === 'group') {
          const open =
            groupContainsPath(item, currentPath) ||
            (pendingPath !== undefined && groupContainsPath(item, pendingPath));
          return (
            <li className="tr-docs-navigation-group" key={item.label}>
              <Collapsible.Root defaultOpen={defaultGroupsOpen || open}>
                <Collapsible.Trigger className="tr-docs-navigation-group-trigger">
                  <span>{item.label}</span>
                  <span aria-hidden="true" className="tr-docs-navigation-chevron">
                    ›
                  </span>
                </Collapsible.Trigger>
                <Collapsible.Panel className="tr-docs-navigation-group-panel">
                  <NavigationItems
                    currentPath={currentPath}
                    defaultGroupsOpen={defaultGroupsOpen}
                    items={item.children}
                    onNavigate={onNavigate}
                    pendingPath={pendingPath}
                    renderLink={renderLink}
                  />
                </Collapsible.Panel>
              </Collapsible.Root>
            </li>
          );
        }
        const state = {
          active: item.path === currentPath,
          pending: item.path !== currentPath && item.path === pendingPath,
        };
        return (
          <li key={item.path}>
            <Link
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
                <Spinner decorative size="sm" variant="primary" />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DocsNavigation({
  currentPath,
  defaultGroupsOpen = false,
  items,
  label = 'Documentation',
  onNavigate,
  pendingPath,
  ref,
  renderLink,
}: DocsNavigationProps) {
  return (
    <nav aria-label={label} className="tr-docs-navigation" ref={ref}>
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
