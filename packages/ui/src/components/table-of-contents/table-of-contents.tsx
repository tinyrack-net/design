'use client';

import { ChevronDown } from 'lucide-react';
import type { ReactElement, Ref } from 'react';
import { Link } from '../link/index.js';
import { Select } from '../select/index.js';

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
  const selectItems = Object.fromEntries(items.map((item) => [item.id, item.label]));
  return (
    <nav aria-label={label} className="tr-table-of-contents" ref={ref}>
      <div className="tr-table-of-contents-desktop">
        <h2>{label}</h2>
        <ContentsList {...listProps} />
      </div>
      <div className="tr-table-of-contents-mobile">
        <Select.Root
          items={selectItems}
          onValueChange={(value, eventDetails) => {
            if (eventDetails.reason !== 'item-press') return;
            items
              .filter((item) => item.id === value)
              .forEach((item) => {
                onNavigate?.(item);
              });
          }}
          value={currentHeading ?? items[0]?.id}
        >
          <Select.Trigger aria-label={mobileLabel} uiSize="md">
            <Select.Value />
            <Select.Icon aria-hidden="true">
              <ChevronDown />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={8}>
              <Select.Popup>
                <Select.List>
                  {items.map((item) => (
                    <Select.Item key={item.id} value={item.id}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator aria-hidden="true">✓</Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
    </nav>
  );
}
