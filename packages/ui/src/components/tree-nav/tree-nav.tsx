'use client';

import { type ComponentPropsWithRef, type ReactNode, useEffect, useState } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';
import { TRCollapsible } from '../collapsible/index.js';

export type TRTreeNavGroup<T = unknown> = {
  /** Highlight the guide rail because the current destination lives in here. */
  activeBranch?: boolean;
  children: readonly TRTreeNavItem<T>[];
  /** Open on mount / re-open when a descendant becomes the active route. */
  forceOpen?: boolean;
  key: string;
  label: ReactNode;
  type: 'group';
};

export type TRTreeNavLeaf<T = unknown> = {
  data: T;
  key: string;
  type: 'leaf';
};

export type TRTreeNavItem<T = unknown> = TRTreeNavGroup<T> | TRTreeNavLeaf<T>;

export type TRTreeNavRenderState = { depth: number };

export type TRTreeNavProps<T = unknown> = Omit<
  ComponentPropsWithRef<'nav'>,
  'aria-label' | 'children'
> & {
  defaultGroupsOpen?: boolean;
  items: readonly TRTreeNavItem<T>[];
  label?: string;
  /** Render the label content of a collapsible group. */
  renderGroupLabel?: (
    item: TRTreeNavGroup<T>,
    state: TRTreeNavRenderState,
  ) => ReactNode;
  /** Render the content of a leaf node (typically a link). */
  renderLeaf: (item: TRTreeNavLeaf<T>, state: TRTreeNavRenderState) => ReactNode;
};

function TreeNavGroup<T>({
  defaultGroupsOpen,
  depth,
  item,
  renderGroupLabel,
  renderLeaf,
}: {
  defaultGroupsOpen: boolean;
  depth: number;
  item: TRTreeNavGroup<T>;
  renderGroupLabel: TRTreeNavProps<T>['renderGroupLabel'];
  renderLeaf: TRTreeNavProps<T>['renderLeaf'];
}) {
  const [open, setOpen] = useState(defaultGroupsOpen || Boolean(item.forceOpen));

  useEffect(() => {
    if (item.forceOpen) setOpen(true);
  }, [item.forceOpen]);

  return (
    <li className="tr-tree-nav-group" data-depth={depth}>
      <TRCollapsible.Root onOpenChange={setOpen} open={open}>
        <TRCollapsible.Trigger
          className="tr-tree-nav-group-trigger"
          data-active-branch={item.activeBranch || undefined}
        >
          <span className="tr-tree-nav-group-label">
            {renderGroupLabel ? renderGroupLabel(item, { depth }) : item.label}
          </span>
          <svg
            aria-hidden="true"
            className="tr-tree-nav-chevron"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </TRCollapsible.Trigger>
        <TRCollapsible.Panel
          className="tr-tree-nav-group-panel"
          data-active-branch={item.activeBranch || undefined}
        >
          <TreeNavList
            defaultGroupsOpen={defaultGroupsOpen}
            depth={depth + 1}
            items={item.children}
            renderGroupLabel={renderGroupLabel}
            renderLeaf={renderLeaf}
          />
        </TRCollapsible.Panel>
      </TRCollapsible.Root>
    </li>
  );
}

function TreeNavList<T>({
  defaultGroupsOpen,
  depth,
  items,
  renderGroupLabel,
  renderLeaf,
}: {
  defaultGroupsOpen: boolean;
  depth: number;
  items: readonly TRTreeNavItem<T>[];
  renderGroupLabel: TRTreeNavProps<T>['renderGroupLabel'];
  renderLeaf: TRTreeNavProps<T>['renderLeaf'];
}) {
  return (
    <ul className="tr-tree-nav-list" data-depth={depth}>
      {items.map((item) =>
        item.type === 'group' ? (
          <TreeNavGroup
            defaultGroupsOpen={defaultGroupsOpen}
            depth={depth}
            item={item}
            key={item.key}
            renderGroupLabel={renderGroupLabel}
            renderLeaf={renderLeaf}
          />
        ) : (
          <li className="tr-tree-nav-item" data-depth={depth} key={item.key}>
            {renderLeaf(item, { depth })}
          </li>
        ),
      )}
    </ul>
  );
}

/**
 * Generic recursive navigation tree: collapsible groups nested to any depth,
 * with per-level guide rails and progressive indentation. Leaf rendering is
 * delegated to the consumer so it stays router- and domain-agnostic.
 */
export function TRTreeNav<T>({
  className,
  defaultGroupsOpen = false,
  items,
  label = 'Navigation',
  ref,
  renderGroupLabel,
  renderLeaf,
  ...props
}: TRTreeNavProps<T>) {
  return (
    <nav
      {...props}
      aria-label={label}
      className={mergeClassNames('tr-tree-nav', className)}
      ref={ref}
    >
      <TreeNavList
        defaultGroupsOpen={defaultGroupsOpen}
        depth={0}
        items={items}
        renderGroupLabel={renderGroupLabel}
        renderLeaf={renderLeaf}
      />
    </nav>
  );
}
