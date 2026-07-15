import '../../core/core.css';
import './docs-navigation.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { DocsNavigation, type DocsNavigationItem } from './index.js';

const items: readonly DocsNavigationItem[] = [
  {
    children: [
      { label: 'Install', path: '/install', type: 'page' },
      {
        children: [{ label: 'Advanced', path: '/advanced', type: 'page' }],
        label: 'Deep dive',
        type: 'group',
      },
    ],
    label: 'Guides',
    type: 'group',
  },
  { external: true, label: 'GitHub', path: 'https://github.com', type: 'link' },
];

test('renders recursive groups, active and pending links, and injected links', async () => {
  const onNavigate = vi.fn();
  await render(
    <DocsNavigation
      currentPath="/install"
      items={items}
      onNavigate={onNavigate}
      pendingPath="/advanced"
      renderLink={(item) => (
        // biome-ignore lint/a11y/useAnchorContent: Base UI injects the DocsNavigation link content into this router slot.
        <a
          aria-label={item.label}
          data-router-link=""
          href={item.path}
          onClick={(event) => event.preventDefault()}
        />
      )}
    />,
  );
  expect(document.querySelector('nav')).toHaveAccessibleName('Documentation');
  expect(document.querySelector('[aria-current="page"]')).toHaveTextContent('Install');
  expect(document.querySelector('[data-pending]')).toHaveTextContent('Advanced');
  expect(document.querySelectorAll('[data-router-link]')).toHaveLength(3);
  await userEvent.click(document.querySelector('[aria-current="page"]') as HTMLElement);
  expect(onNavigate).toHaveBeenCalledWith(
    items[0]?.type === 'group' ? items[0].children[0] : null,
  );
  expect(getComputedStyle(document.querySelector('nav') as HTMLElement).display).toBe(
    'grid',
  );
});

test('uses native destinations and localized labels when adapters are omitted', async () => {
  await render(<DocsNavigation currentPath="/none" items={items} label="문서" />);
  expect(document.querySelector('nav')).toHaveAccessibleName('문서');
  expect(document.querySelector('a[href="https://github.com"]')).not.toBeNull();
  const closedGroup = Array.from(document.querySelectorAll('button')).find((button) =>
    button.textContent?.includes('Guides'),
  );
  expect(closedGroup).toHaveAttribute('aria-expanded', 'false');
});

test('can reveal all groups by default for always-visible documentation trees', async () => {
  await render(<DocsNavigation currentPath="/none" defaultGroupsOpen items={items} />);
  expect(document.querySelector('button')).toHaveAttribute('aria-expanded', 'true');
  expect(document.querySelector('a[href="/advanced"]')).not.toBeNull();
  expect(getComputedStyle(document.querySelector('nav') as HTMLElement).rowGap).toBe(
    '32px',
  );
  const group = document.querySelector('.tr-collapsible') as HTMLElement;
  const panel = document.querySelector('.tr-collapsible-content') as HTMLElement;
  expect(getComputedStyle(group).borderWidth).toBe('0px');
  expect(getComputedStyle(group).borderRadius).toBe('0px');
  expect(getComputedStyle(panel).borderTopWidth).toBe('0px');
  expect(getComputedStyle(panel).padding).toBe('0px');
});
