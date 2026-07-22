import '../../core/core.css';
import './link.css';
import { act, type ComponentProps, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRLink } from './index.js';

afterEach(() => {
  delete document.documentElement.dataset['theme'];
});

function RouterLink({ to, ...props }: ComponentProps<'a'> & { to: string }) {
  return <a {...props} href={to} />;
}

test('renders a semantic anchor with Tinyrack variants', async () => {
  const ref = createRef<HTMLAnchorElement>();
  await render(
    <TRLink ref={ref} href="/docs" underline="always" variant="danger">
      Docs
    </TRLink>,
  );
  expect(ref.current?.pathname).toBe('/docs');
  expect(ref.current?.dataset['underline']).toBe('always');
  expect(ref.current?.dataset['variant']).toBe('danger');
});

test('preserves native current state, attributes, styles, classes, and events', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const onFocus = vi.fn();
  const ref = createRef<HTMLAnchorElement>();
  const screen = await render(
    <TRLink
      aria-current="page"
      className="inventory-link"
      href="#current-destination"
      onFocus={onFocus}
      ref={ref}
      style={{ inlineSize: '12rem' }}
    >
      Current inventory
    </TRLink>,
  );
  const link = screen.getByRole('link', { name: 'Current inventory' });

  await link.hover();
  await userEvent.tab();
  await expect.element(link).toHaveFocus();
  await expect.element(link).toHaveAttribute('aria-current', 'page');
  await expect.element(link).toHaveClass('tr-link', 'inventory-link');
  expect(getComputedStyle(ref.current as HTMLAnchorElement).inlineSize).toBe('192px');
  expect(getComputedStyle(ref.current as HTMLAnchorElement).outlineStyle).toBe('solid');
  expect(onFocus).toHaveBeenCalledOnce();
});

test('blocks pointer and keyboard navigation when disabled', async () => {
  const onClick = vi.fn();
  const onKeyDown = vi.fn();
  await render(
    <TRLink
      disabled
      href="#disabled-destination"
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      Disabled destination
    </TRLink>,
  );
  const link = document.querySelector<HTMLAnchorElement>('.tr-link');
  expect(link?.hasAttribute('href')).toBe(false);
  expect(link?.getAttribute('aria-disabled')).toBe('true');
  link?.focus();
  await userEvent.keyboard('{Escape}');
  await userEvent.keyboard('{Enter}');
  link?.click();
  expect(onClick).not.toHaveBeenCalled();
  expect(onKeyDown).toHaveBeenCalledOnce();
  expect(onKeyDown.mock.calls[0]?.[0].key).toBe('Escape');
  expect(window.location.hash).not.toBe('#disabled-destination');
});

test('forwards pointer and keyboard interactions when enabled', async () => {
  const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  });
  const onKeyDown = vi.fn();
  await render(
    <TRLink href="#enabled-destination" onClick={onClick} onKeyDown={onKeyDown}>
      Enabled destination
    </TRLink>,
  );
  const link = document.querySelector<HTMLAnchorElement>('.tr-link');

  await userEvent.click(link as HTMLAnchorElement);
  link?.focus();
  await userEvent.keyboard('{ArrowRight}');

  expect(onClick).toHaveBeenCalledOnce();
  expect(onKeyDown).toHaveBeenCalledOnce();
  expect(onKeyDown.mock.calls[0]?.[0].key).toBe('ArrowRight');
  expect(window.location.hash).not.toBe('#enabled-destination');
});

test('keeps native Enter activation and Space behavior', async () => {
  const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  });
  const screen = await render(
    <TRLink href="#keyboard-destination" onClick={onClick}>
      Keyboard destination
    </TRLink>,
  );
  const link = screen.getByRole('link', { name: 'Keyboard destination' });

  await userEvent.type(link, '{Enter}');
  expect(onClick).toHaveBeenCalledOnce();
  await userEvent.type(link, '[Space]');
  expect(onClick).toHaveBeenCalledOnce();
  await expect.element(link).toHaveFocus();
});

test('maps the default and muted public variants to their semantic colors', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <div>
      <TRLink data-testid="default" href="/default" variant="default">
        Default
      </TRLink>
      <TRLink data-testid="muted" href="/muted" variant="muted">
        Muted
      </TRLink>
    </div>,
  );
  const defaultLink = document.querySelector<HTMLElement>('[data-testid="default"]');
  const mutedLink = document.querySelector<HTMLElement>('[data-testid="muted"]');
  expect(getComputedStyle(defaultLink as HTMLElement).color).not.toBe(
    getComputedStyle(mutedLink as HTMLElement).color,
  );
});

test('computes every underline style', async () => {
  await render(
    <div>
      <TRLink data-testid="always" href="/always" underline="always">
        Always
      </TRLink>
      <TRLink data-testid="hover" href="/hover" underline="hover">
        Hover
      </TRLink>
      <TRLink data-testid="none" href="/none" underline="none">
        None
      </TRLink>
    </div>,
  );
  const always = document.querySelector<HTMLElement>('[data-testid="always"]');
  const hover = document.querySelector<HTMLElement>('[data-testid="hover"]');
  const none = document.querySelector<HTMLElement>('[data-testid="none"]');

  expect(getComputedStyle(always as HTMLElement).textDecorationLine).toBe('underline');
  expect(getComputedStyle(hover as HTMLElement).textDecorationLine).toBe('underline');
  expect(getComputedStyle(hover as HTMLElement).textDecorationColor).toBe(
    'rgba(0, 0, 0, 0)',
  );
  expect(getComputedStyle(none as HTMLElement).textDecorationLine).toBe('none');
});

test('preserves native external and download destination attributes', async () => {
  await render(
    <div>
      <TRLink
        data-testid="external"
        href="https://tinyrack.net"
        rel="noreferrer"
        target="_blank"
      >
        Tinyrack website (opens in new tab)
      </TRLink>
      <TRLink
        data-testid="download"
        download="rack-inventory.csv"
        href="/rack-inventory.csv"
      >
        Download inventory
      </TRLink>
    </div>,
  );
  const external = document.querySelector<HTMLAnchorElement>(
    '[data-testid="external"]',
  );
  const download = document.querySelector<HTMLAnchorElement>(
    '[data-testid="download"]',
  );
  expect(external?.target).toBe('_blank');
  expect(external?.rel).toBe('noreferrer');
  expect(download?.download).toBe('rack-inventory.csv');
});

test('composes a router-style rendered anchor without DOM nesting', async () => {
  await render(
    <TRLink href="/racks" render={<a data-router-link="true" href="/racks" />}>
      Racks
    </TRLink>,
  );
  const link = document.querySelector<HTMLAnchorElement>('[data-router-link="true"]');
  expect(link?.classList.contains('tr-link')).toBe(true);
  expect(link?.pathname).toBe('/racks');
  expect(link?.querySelector('a')).toBeNull();
});

test('removes the destination supplied by a rendered anchor when disabled', async () => {
  const onClick = vi.fn();
  await render(
    <TRLink
      disabled
      onClick={onClick}
      render={<a data-router-link="disabled" href="#router-destination" />}
    >
      Disabled router destination
    </TRLink>,
  );
  const link = document.querySelector<HTMLAnchorElement>(
    '[data-router-link="disabled"]',
  );

  expect(link?.hasAttribute('href')).toBe(false);
  link?.click();
  expect(onClick).not.toHaveBeenCalled();
  expect(window.location.hash).not.toBe('#router-destination');
});

test('blocks activation when a router component generates its own destination', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <TRLink disabled onClick={onClick} render={<RouterLink to="#router-generated" />}>
      Disabled generated router destination
    </TRLink>,
  );
  const link = screen.getByText('Disabled generated router destination');

  await expect.element(link).toHaveAttribute('href', '#router-generated');
  (link.element() as HTMLElement).click();
  expect(onClick).not.toHaveBeenCalled();
  expect(window.location.hash).not.toBe('#router-generated');
});

test('keeps variant defaults overridable through the public color token', async () => {
  await render(
    <TRLink
      data-testid="custom-color"
      href="/danger"
      style={{ '--tr-link-color': 'rgb(1, 2, 3)' } as React.CSSProperties}
      variant="danger"
    >
      Custom danger color
    </TRLink>,
  );
  const link = document.querySelector<HTMLElement>('[data-testid="custom-color"]');

  expect(getComputedStyle(link as HTMLElement).color).toBe('rgb(1, 2, 3)');
});

test('server renders and hydrates native and rendered links without a mismatch', async () => {
  const fixture = (
    <div>
      <TRLink aria-current="page" href="/racks">
        Racks
      </TRLink>
      <TRLink render={<a data-router-link="ssr" href="/settings" />}>Settings</TRLink>
    </div>
  );
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  let root: ReturnType<typeof hydrateRoot> | undefined;

  await act(async () => {
    root = hydrateRoot(host, fixture);
  });
  expect(host.querySelectorAll('.tr-link')).toHaveLength(2);
  expect(host.querySelector('[aria-current="page"]')).not.toBeNull();
  expect(
    consoleError.mock.calls.some((call) => String(call[0]).includes('hydration')),
  ).toBe(false);
  await act(async () => root?.unmount());
  host.remove();
  consoleError.mockRestore();
});
