import '../../core/core.css';
import './docs-navigation.css';
import { act, type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRDocsNavigation, type TRDocsNavigationItem } from './index.js';

const items: readonly TRDocsNavigationItem[] = [
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
    <TRDocsNavigation
      currentPath="/install"
      items={items}
      onNavigate={onNavigate}
      pendingPath="/advanced"
      renderLink={(item) => (
        // biome-ignore lint/a11y/useAnchorContent: Base UI injects the TRDocsNavigation link content into this router slot.
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
  expect(document.querySelectorAll('.tr-tree-nav-chevron')).toHaveLength(2);
  expect(
    getComputedStyle(document.querySelector('.tr-tree-nav-chevron') as SVGElement)
      .display,
  ).not.toBe('none');
  await userEvent.click(document.querySelector('[aria-current="page"]') as HTMLElement);
  expect(onNavigate).toHaveBeenCalledWith(
    items[0]?.type === 'group' ? items[0].children[0] : null,
  );
  expect(getComputedStyle(document.querySelector('nav') as HTMLElement).display).toBe(
    'grid',
  );
});

test('uses native destinations and localized labels when adapters are omitted', async () => {
  await render(<TRDocsNavigation currentPath="/none" items={items} label="문서" />);
  expect(document.querySelector('nav')).toHaveAccessibleName('문서');
  expect(document.querySelector('a[href="https://github.com"]')).not.toBeNull();
  const closedGroup = Array.from(document.querySelectorAll('button')).find((button) =>
    button.textContent?.includes('Guides'),
  );
  expect(closedGroup).toHaveAttribute('aria-expanded', 'false');
});

test('can reveal all groups by default for always-visible documentation trees', async () => {
  await render(
    <TRDocsNavigation currentPath="/none" defaultGroupsOpen items={items} />,
  );
  expect(document.querySelector('button')).toHaveAttribute('aria-expanded', 'true');
  expect(document.querySelector('a[href="/advanced"]')).not.toBeNull();
  expect(
    getComputedStyle(document.querySelector('.tr-tree-nav-list') as HTMLElement).rowGap,
  ).toBe('16px');
  const group = document.querySelector('.tr-collapsible') as HTMLElement;
  const panel = document.querySelector('.tr-collapsible-content') as HTMLElement;
  expect(getComputedStyle(group).borderWidth).toBe('0px');
  expect(getComputedStyle(group).borderRadius).toBe('0px');
  expect(getComputedStyle(panel).borderTopWidth).toBe('0px');
  expect(getComputedStyle(panel).paddingBlockStart).toBe('4px');
});

test('forwards native nav props, styles, events, and its React 19 ref', async () => {
  const ref = createRef<HTMLElement>();
  const onClick = vi.fn();
  await render(
    <TRDocsNavigation
      className="consumer-navigation"
      currentPath="/install"
      data-testid="docs-nav"
      items={items}
      onClick={onClick}
      ref={ref}
      style={
        {
          '--tr-docs-navigation-link-active-border-color': 'rgb(1, 2, 3)',
          maxWidth: 240,
        } as CSSProperties
      }
    />,
  );

  const navigation = document.querySelector('[data-testid="docs-nav"]');
  expect(navigation).toBe(ref.current);
  expect(navigation).toHaveClass('tr-docs-navigation', 'consumer-navigation');
  expect(navigation).toHaveStyle({ maxWidth: '240px' });
  expect(
    getComputedStyle(document.querySelector('[aria-current="page"]') as HTMLElement)
      .borderInlineStartColor,
  ).toBe('rgb(1, 2, 3)');
  await userEvent.click(document.querySelector('button') as HTMLButtonElement);
  expect(onClick).toHaveBeenCalledOnce();
});

test('opens nested groups when current or pending route state changes', async () => {
  const view = await render(<TRDocsNavigation currentPath="/none" items={items} />);
  const triggers = () => [...document.querySelectorAll('button')];
  expect(triggers()[0]).toHaveAttribute('aria-expanded', 'false');

  await view.rerender(<TRDocsNavigation currentPath="/advanced" items={items} />);
  expect(triggers()[0]).toHaveAttribute('aria-expanded', 'true');
  expect(triggers()[1]).toHaveAttribute('aria-expanded', 'true');

  await view.rerender(
    <TRDocsNavigation currentPath="/none" items={items} pendingPath="/advanced" />,
  );
  expect(document.querySelector('[data-pending]')).toHaveTextContent('Advanced');
});

test('supports keyboard group disclosure and keeps long labels inside narrow layouts', async () => {
  const longItems: readonly TRDocsNavigationItem[] = [
    {
      children: [
        {
          label:
            'A documentation destination with an exceptionally long unbroken-label',
          path: '/long',
          type: 'page',
        },
      ],
      label: 'Reference',
      type: 'group',
    },
  ];
  await render(
    <div style={{ inlineSize: 160 }}>
      <TRDocsNavigation currentPath="/none" items={longItems} />
    </div>,
  );
  const trigger = document.querySelector('button') as HTMLButtonElement;
  trigger.focus();
  await userEvent.keyboard('{Enter}');
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const navigation = document.querySelector('nav') as HTMLElement;
  expect(navigation.scrollWidth).toBeLessThanOrEqual(navigation.clientWidth);
});

test('renders current state on the server and hydrates without recovery', async () => {
  const fixture = <TRDocsNavigation currentPath="/advanced" items={items} />;
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  expect(host.querySelector('[aria-current="page"]')).toHaveTextContent('Advanced');
  expect(host.querySelectorAll('[aria-expanded="true"]')).toHaveLength(2);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  await act(async () => root.unmount());
  host.remove();
});
