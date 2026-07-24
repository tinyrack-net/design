'use client';

import { TRLink } from '@tinyrack/ui/components/link';
import { TRSelect } from '@tinyrack/ui/components/select';
import { ChevronDown } from 'lucide-react';
import type { ComponentProps, ReactElement } from 'react';
import { mergeClassNames } from '../utils/component-class-name.ts';

export type TRTableOfContentsItem = {
  depth: 2 | 3;
  id: string;
  label: string;
};

export type TRTableOfContentsProps = Omit<ComponentProps<'nav'>, 'children'> & {
  currentHeading?: string;
  items: readonly TRTableOfContentsItem[];
  label?: string;
  mobileLabel?: string;
  onNavigate?: (item: TRTableOfContentsItem) => void;
  renderLink?: (item: TRTableOfContentsItem) => ReactElement;
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
  const sections: Array<{
    children: TRTableOfContentsItem[];
    item: TRTableOfContentsItem;
  }> = [];
  for (const item of items) {
    const section = sections.at(-1);
    if (item.depth === 3 && section?.item.depth === 2) {
      section.children.push(item);
    } else {
      sections.push({ children: [], item });
    }
  }

  function renderItem(item: TRTableOfContentsItem) {
    return (
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
    );
  }

  return (
    <ol className="tr-table-of-contents-list">
      {sections.map(({ children, item }) => (
        <li data-depth={item.depth} key={item.id}>
          {renderItem(item)}
          {children.length === 0 ? null : (
            <ol className="tr-table-of-contents-list">
              {children.map((child) => (
                <li data-depth={child.depth} key={child.id}>
                  {renderItem(child)}
                </li>
              ))}
            </ol>
          )}
        </li>
      ))}
    </ol>
  );
}

export function TRTableOfContents({
  className,
  currentHeading,
  items,
  label = 'On this page',
  mobileLabel = 'On this page',
  onNavigate,
  ref,
  renderLink,
  ...props
}: TRTableOfContentsProps) {
  if (items.length === 0) return null;
  const listProps = { currentHeading, items, onNavigate, renderLink };
  const selectItems = Object.fromEntries(items.map((item) => [item.id, item.label]));
  const selectedHeading = items.some((item) => item.id === currentHeading)
    ? currentHeading
    : items[0]?.id;
  return (
    <nav
      {...props}
      aria-label={label}
      className={mergeClassNames('tr-table-of-contents', className)}
      ref={ref}
    >
      <div className="tr-table-of-contents-desktop">
        <h2>{label}</h2>
        <ContentsList {...listProps} />
      </div>
      <div className="tr-table-of-contents-mobile">
        <TRSelect.Root
          items={selectItems}
          onValueChange={(value, eventDetails) => {
            if (eventDetails.reason !== 'item-press') return;
            const item = items.find(
              (candidate) => candidate.id === value,
            ) as TRTableOfContentsItem;
            if (onNavigate) onNavigate(item);
            else window.location.hash = encodeURIComponent(item.id);
          }}
          value={selectedHeading}
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
                    <TRSelect.Item
                      data-depth={item.depth}
                      key={item.id}
                      value={item.id}
                    >
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
