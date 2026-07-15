'use client';

import type { ReactElement, Ref } from 'react';
import { Link } from '../link/index.js';

export type TableOfContentsItem = {
  depth: 2 | 3;
  id: string;
  label: string;
};

export type TableOfContentsProps = {
  currentHeading?: string;
  items: readonly TableOfContentsItem[];
  label?: string;
  mobileLabel?: string;
  onNavigate?: (item: TableOfContentsItem) => void;
  renderLink?: (item: TableOfContentsItem) => ReactElement;
  ref?: Ref<HTMLElement>;
};

function ContentsList({
  currentHeading,
  items,
  onNavigate,
  renderLink,
}: {
  currentHeading: string | undefined;
  items: readonly TableOfContentsItem[];
  onNavigate: TableOfContentsProps['onNavigate'] | undefined;
  renderLink: TableOfContentsProps['renderLink'] | undefined;
}) {
  return (
    <ol className="tr-table-of-contents-list">
      {items.map((item) => (
        <li data-depth={item.depth} key={item.id}>
          <Link
            aria-current={currentHeading === item.id ? 'location' : undefined}
            data-active={currentHeading === item.id || undefined}
            href={`#${encodeURIComponent(item.id)}`}
            onClick={() => onNavigate?.(item)}
            render={renderLink?.(item)}
            underline="none"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function TableOfContents({
  currentHeading,
  items,
  label = 'On this page',
  mobileLabel = 'On this page',
  onNavigate,
  ref,
  renderLink,
}: TableOfContentsProps) {
  if (items.length === 0) return null;
  const listProps = { currentHeading, items, onNavigate, renderLink };
  return (
    <nav aria-label={label} className="tr-table-of-contents" ref={ref}>
      <div className="tr-table-of-contents-desktop">
        <h2>{label}</h2>
        <ContentsList {...listProps} />
      </div>
      <details className="tr-table-of-contents-mobile">
        <summary>{mobileLabel}</summary>
        <ContentsList {...listProps} />
      </details>
    </nav>
  );
}
