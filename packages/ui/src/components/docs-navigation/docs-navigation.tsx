'use client';

import type { ComponentPropsWithRef, ReactElement } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRLink } from '../link/index.js';
import { TRSpinner } from '../spinner/index.js';
import {
  TRTreeNav,
  type TRTreeNavGroup,
  type TRTreeNavItem,
  type TRTreeNavLeaf,
} from '../tree-nav/index.js';

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

type TRDocsNavigationLeafData = TRDocsNavigationLink | TRDocsNavigationPage;

function groupContainsPath(group: TRDocsNavigationGroup, path: string): boolean {
  return group.children.some((item) =>
    item.type === 'group' ? groupContainsPath(item, path) : item.path === path,
  );
}

function toTreeItems(
  items: readonly TRDocsNavigationItem[],
  currentPath: string,
  pendingPath: string | undefined,
): readonly TRTreeNavItem<TRDocsNavigationLeafData>[] {
  return items.map((item) => {
    if (item.type === 'group') {
      const containsCurrent = groupContainsPath(item, currentPath);
      const containsPending =
        pendingPath !== undefined && groupContainsPath(item, pendingPath);
      return {
        activeBranch: containsCurrent,
        children: toTreeItems(item.children, currentPath, pendingPath),
        forceOpen: containsCurrent || containsPending,
        key: item.label,
        label: item.label,
        type: 'group',
      } satisfies TRTreeNavGroup<TRDocsNavigationLeafData>;
    }
    return {
      data: item,
      key: item.path,
      type: 'leaf',
    } satisfies TRTreeNavLeaf<TRDocsNavigationLeafData>;
  });
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
    <TRTreeNav<TRDocsNavigationLeafData>
      {...props}
      className={mergeClassNames('tr-docs-navigation', className)}
      defaultGroupsOpen={defaultGroupsOpen}
      items={toTreeItems(items, currentPath, pendingPath)}
      label={label}
      ref={ref}
      renderLeaf={({ data: item }, { depth }) => {
        const state = {
          active: item.path === currentPath,
          pending: item.path !== currentPath && item.path === pendingPath,
        };
        return (
          <TRLink
            aria-current={state.active ? 'page' : undefined}
            className="tr-docs-navigation-link"
            data-active={state.active || undefined}
            data-depth={depth}
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
        );
      }}
    />
  );
}
