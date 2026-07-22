import '../../core/core.css';
import './table-of-contents.css';
import { act, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRTableOfContents } from './index.js';

const items = [
  { depth: 2 as const, id: 'install', label: 'Install' },
  { depth: 3 as const, id: 'windows setup', label: 'Windows' },
];

test('renders active headings, router links, and mobile select', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const onNavigate = vi.fn();
  const view = await render(
    <TRTableOfContents
      currentHeading="install"
      items={items}
      onNavigate={onNavigate}
      renderLink={(item) => (
        // biome-ignore lint/a11y/useAnchorContent: Base UI injects the heading label into this router slot.
        <a aria-label={item.label} data-router-link="" href={`#${item.id}`} />
      )}
    />,
  );
  expect(document.querySelector('[aria-current="location"]')).toHaveTextContent(
    'Install',
  );
  const activeLink = document.querySelector<HTMLElement>('[aria-current="location"]');
  const inactiveLink = document.querySelector<HTMLElement>('a:not([aria-current])');
  expect(activeLink).not.toBeNull();
  expect(inactiveLink).not.toBeNull();
  expect(getComputedStyle(activeLink as HTMLElement).backgroundColor).not.toBe(
    getComputedStyle(inactiveLink as HTMLElement).backgroundColor,
  );
  expect(getComputedStyle(activeLink as HTMLElement).fontWeight).toBe('600');
  expect(document.querySelectorAll('[data-router-link]')).toHaveLength(2);
  (activeLink as HTMLElement).click();
  expect(onNavigate).toHaveBeenCalledWith(items[0]);
  expect(onNavigate).toHaveBeenCalledTimes(1);
  onNavigate.mockClear();
  const select = document.querySelector('[role="combobox"]') as HTMLElement;
  expect(select).toHaveAccessibleName('On this page');
  await userEvent.click(select);
  await userEvent.click(
    document.querySelectorAll<HTMLElement>('[role="option"]')[1] as HTMLElement,
  );
  expect(onNavigate).toHaveBeenCalledWith(items[1]);
  expect(onNavigate).toHaveBeenCalledTimes(1);

  onNavigate.mockClear();
  const nextItems = [{ depth: 2 as const, id: 'usage', label: 'Usage' }];
  await view.rerender(
    <TRTableOfContents
      currentHeading="install"
      items={nextItems}
      onNavigate={onNavigate}
    />,
  );
  await expect.poll(() => onNavigate.mock.calls.length).toBe(0);
  await view.rerender(
    <TRTableOfContents
      currentHeading="usage"
      items={nextItems}
      onNavigate={onNavigate}
    />,
  );
  await expect.poll(() => onNavigate.mock.calls.length).toBe(0);
  await view.rerender(
    <TRTableOfContents currentHeading="usage" items={items} onNavigate={onNavigate} />,
  );
  await expect.poll(() => onNavigate.mock.calls.length).toBe(0);
  await view.rerender(
    <TRTableOfContents
      currentHeading="install"
      items={items}
      onNavigate={onNavigate}
    />,
  );
  await expect.poll(() => onNavigate.mock.calls.length).toBe(0);
});

test('navigates from the mobile select with the keyboard', async () => {
  const onNavigate = vi.fn();
  await render(
    <TRTableOfContents
      currentHeading="install"
      items={items}
      onNavigate={onNavigate}
    />,
  );

  await userEvent.click(document.querySelector('[role="combobox"]') as HTMLElement);
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{Enter}');
  expect(onNavigate).toHaveBeenCalledWith(items[1]);
  expect(onNavigate).toHaveBeenCalledTimes(1);
});

test('returns no landmark for an empty outline and supports localized labels', async () => {
  const view = await render(<TRTableOfContents items={[]} />);
  expect(document.querySelector('nav')).toBeNull();
  await view.unmount();
  await render(
    <TRTableOfContents items={items} label="이 페이지" mobileLabel="목차" />,
  );
  expect(document.querySelector('nav')).toHaveAccessibleName('이 페이지');
  const localizedSelect = document.querySelector('[role="combobox"]') as HTMLElement;
  expect(localizedSelect).toHaveAccessibleName('목차');
  await userEvent.click(localizedSelect);
  await userEvent.click(document.querySelector('[role="option"]') as HTMLElement);
});

test('nests h3 items under their preceding h2 item', async () => {
  await render(<TRTableOfContents items={items} />);

  const section = document.querySelector('li[data-depth="2"]');
  expect(section?.querySelector(':scope > a')).toHaveTextContent('Install');
  expect(
    section?.querySelector(':scope > ol > li[data-depth="3"] > a'),
  ).toHaveTextContent('Windows');
});

test('preserves nav props, refs, and composed router events', async () => {
  const ref = createRef<HTMLElement>();
  const onNavClick = vi.fn();
  const onRouterClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
  const onNavigate = vi.fn();
  await render(
    <TRTableOfContents
      className="consumer-outline"
      data-owner="docs"
      items={items}
      onClick={onNavClick}
      onNavigate={onNavigate}
      ref={ref}
      renderLink={(item) => (
        // biome-ignore lint/a11y/useAnchorContent: Base UI injects the heading label into this router slot.
        <a href={`#${item.id}`} onClick={onRouterClick} />
      )}
      style={{ maxWidth: 240 }}
    />,
  );

  const nav = document.querySelector('nav');
  const link = document.querySelector<HTMLElement>('a');
  expect(ref.current).toBe(nav);
  expect(nav).toHaveClass('tr-table-of-contents', 'consumer-outline');
  expect(nav).toHaveAttribute('data-owner', 'docs');
  expect(nav).toHaveStyle({ maxWidth: '240px' });

  link?.click();
  expect(onRouterClick).toHaveBeenCalledTimes(1);
  expect(onNavigate).toHaveBeenCalledWith(items[0]);
  expect(onNavClick).toHaveBeenCalledTimes(1);
});

test('keeps mobile selection uncontrolled and falls back to encoded hash navigation', async () => {
  const initialUrl = window.location.href;
  await render(<TRTableOfContents items={items} />);

  const select = document.querySelector('[role="combobox"]') as HTMLElement;
  await userEvent.click(select);
  await userEvent.click(
    document.querySelectorAll<HTMLElement>('[role="option"]')[1] as HTMLElement,
  );

  expect(select).toHaveTextContent('Windows');
  expect(window.location.hash).toBe('#windows%20setup');
  window.history.replaceState(null, '', initialUrl);
});

test('updates autofilled selection without treating it as navigation', async () => {
  const initialUrl = window.location.href;
  const onNavigate = vi.fn();
  await render(<TRTableOfContents items={items} onNavigate={onNavigate} />);

  const select = document.querySelector('[role="combobox"]') as HTMLElement;
  const input = document.querySelector<HTMLInputElement>('input[aria-hidden="true"]');
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  expect(input).not.toBeNull();
  expect(valueSetter).toBeTypeOf('function');

  await act(async () => {
    valueSetter?.call(input, 'windows setup');
    input?.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();
  });

  await expect.poll(() => select.textContent).toContain('Windows');
  expect(onNavigate).not.toHaveBeenCalled();
  expect(window.location.href).toBe(initialUrl);
});

test('contains long labels without horizontal overflow', async () => {
  await render(
    <TRTableOfContents
      items={[
        {
          depth: 2,
          id: 'long-heading',
          label: 'averylongheadinglabelthatcannotnormallywrap',
        },
      ]}
      style={{ width: 180 }}
    />,
  );

  const nav = document.querySelector<HTMLElement>('nav');
  const link = document.querySelector<HTMLElement>('a');
  expect(getComputedStyle(link as HTMLElement).overflowWrap).toBe('anywhere');
  expect(nav?.scrollWidth).toBeLessThanOrEqual(nav?.clientWidth ?? 0);
});

test('renders on the server and hydrates without recoverable errors', async () => {
  const fixture = (
    <TRTableOfContents currentHeading="install" items={items} label="Page sections" />
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('nav')).toHaveAccessibleName('Page sections');
  expect(host.querySelector('[aria-current="location"]')).toHaveTextContent('Install');

  await act(async () => root.unmount());
  host.remove();
});
