'use client';

import { ChevronDown } from 'lucide-react';
import type { ReactElement, Ref } from 'react';
import { TRLink } from '../link/index.js';
import { TRSelect } from '../select/index.js';

export type TRTableOfContentsItem = {
  depth: 2 | 3;
  id: string;
  label: string;
};

export type TRTableOfContentsProps = {
  currentHeading?: string;
  items: readonly TRTableOfContentsItem[];
  label?: string;
  mobileLabel?: string;
  onNavigate?: (item: TRTableOfContentsItem) => void;
  renderLink?: (item: TRTableOfContentsItem) => ReactElement;
  ref?: Ref<HTMLElement>;
};

function ContentsList({
  currentHeading,
  items,
  onNavigate,
  renderLink,
}: {
  currentHeading: string | undefined;
  items: readonly TRTableOfContentsItem[];
  onNavigate: TRTableOfContentsProps['onNavigate'] | undefined;
  renderLink: TRTableOfContentsProps['renderLink'] | undefined;
}) {
  return (
    <ol className="tr-table-of-contents-list">
      {items.map((item) => (
        <li data-depth={item.depth} key={item.id}>
          <TRLink
            aria-current={currentHeading === item.id ? 'location' : undefined}
            data-active={currentHeading === item.id || undefined}
            href={`#${encodeURIComponent(item.id)}`}
            onClick={() => onNavigate?.(item)}
            render={renderLink?.(item)}
            underline="none"
          >
            {item.label}
          </TRLink>
        </li>
      ))}
    </ol>
  );
}

export function TRTableOfContents({
  currentHeading,
  items,
  label = 'On this page',
  mobileLabel = 'On this page',
  onNavigate,
  ref,
  renderLink,
}: TRTableOfContentsProps) {
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
        <TRSelect.Root
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
          <TRSelect.Trigger aria-label={mobileLabel} uiSize="md">
            <TRSelect.Value />
            <TRSelect.Icon aria-hidden="true">
              <ChevronDown />
            </TRSelect.Icon>
          </TRSelect.Trigger>
          <TRSelect.Portal>
            <TRSelect.Positioner sideOffset={8}>
              <TRSelect.Popup>
                <TRSelect.List>
                  {items.map((item) => (
                    <TRSelect.Item key={item.id} value={item.id}>
                      <TRSelect.ItemText>{item.label}</TRSelect.ItemText>
                      <TRSelect.ItemIndicator aria-hidden="true">
                        ✓
                      </TRSelect.ItemIndicator>
                    </TRSelect.Item>
                  ))}
                </TRSelect.List>
              </TRSelect.Popup>
            </TRSelect.Positioner>
          </TRSelect.Portal>
        </TRSelect.Root>
      </div>
    </nav>
  );
}
