import '../../core/core.css';
import './breadcrumbs.css';
import { act, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRBreadcrumbs } from './index.js';

const items = [
  { href: '/', label: 'Home' },
  { href: '/components', label: 'Components' },
  { label: 'Breadcrumbs' },
];

test('renders a link for every item but the current page', async () => {
  await render(<TRBreadcrumbs items={items} />);
  const nav = document.querySelector('nav');
  expect(nav).toHaveAccessibleName('Breadcrumb');
  const links = nav?.querySelectorAll('a') ?? [];
  expect(links).toHaveLength(2);
  expect(links[0]).toHaveAccessibleName('Home');
  expect(links[1]).toHaveAccessibleName('Components');
  const current = nav?.querySelector('[aria-current="page"]');
  expect(current).toHaveTextContent('Breadcrumbs');
  expect(current?.tagName).toBe('SPAN');
});

test('renders a non-final item without href as plain text without aria-current', async () => {
  await render(
    <TRBreadcrumbs
      items={[{ href: '/', label: 'Home' }, { label: 'Unlinked section' }, items[2]]}
    />,
  );
  const nav = document.querySelector('nav');
  const spans = nav?.querySelectorAll('.tr-breadcrumbs-current') ?? [];
  expect(spans).toHaveLength(2);
  const unlinked = Array.from(spans).find(
    (span) => span.textContent === 'Unlinked section',
  );
  expect(unlinked).not.toHaveAttribute('aria-current');
});

test('renders a separator between every item but not after the last', async () => {
  await render(<TRBreadcrumbs items={items} />);
  const separators = document.querySelectorAll('.tr-breadcrumbs-separator');
  expect(separators).toHaveLength(items.length - 1);
  for (const separator of separators) {
    expect(separator).toHaveAttribute('aria-hidden', 'true');
    expect(separator).toHaveTextContent('/');
  }
});

test('supports a custom separator and localized landmark label', async () => {
  await render(<TRBreadcrumbs items={items} label="탐색 경로" separator="›" />);
  expect(document.querySelector('nav')).toHaveAccessibleName('탐색 경로');
  expect(document.querySelector('.tr-breadcrumbs-separator')).toHaveTextContent('›');
});

test('composes a router-neutral link via renderLink', async () => {
  await render(
    <TRBreadcrumbs
      items={items}
      renderLink={(item) => (
        // biome-ignore lint/a11y/useAnchorContent: Base UI injects the link content into this router slot.
        // biome-ignore lint/a11y/useValidAnchor: Base UI injects the href into this router slot.
        <a data-router-link={item.label} />
      )}
    />,
  );
  expect(document.querySelectorAll('[data-router-link]')).toHaveLength(2);
});

test('renders nothing for an empty item list', async () => {
  await render(<TRBreadcrumbs items={[]} />);
  expect(document.querySelector('nav')).toBeNull();
});

test('preserves nav props, styles, refs, and native events', async () => {
  const ref = createRef<HTMLElement>();
  const onClick = vi.fn((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  });
  await render(
    <TRBreadcrumbs
      className="consumer-breadcrumbs"
      data-testid="breadcrumbs"
      items={items}
      onClick={onClick}
      ref={ref}
      style={{ marginBlockStart: '7px' }}
    />,
  );

  const nav = document.querySelector<HTMLElement>('[data-testid="breadcrumbs"]');
  expect(ref.current).toBe(nav);
  expect(nav).toHaveClass('tr-breadcrumbs', 'consumer-breadcrumbs');
  expect(nav?.style.marginBlockStart).toBe('7px');
  await userEvent.click(nav?.querySelector('a') as HTMLAnchorElement);
  expect(onClick).toHaveBeenCalledOnce();
});

test('server renders and hydrates without a mismatch', async () => {
  const fixture = <TRBreadcrumbs items={items} />;
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  let root: ReturnType<typeof hydrateRoot> | undefined;

  await act(async () => {
    root = hydrateRoot(host, fixture);
  });
  expect(host.querySelectorAll('.tr-breadcrumbs-item')).toHaveLength(items.length);
  expect(
    consoleError.mock.calls.some((call) => String(call[0]).includes('hydration')),
  ).toBe(false);
  await act(async () => root?.unmount());
  host.remove();
  consoleError.mockRestore();
});
