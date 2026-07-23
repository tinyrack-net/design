import '../../core/core.css';
import './link-button.css';
import { act, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRButton } from '../button/index.js';
import { TRLinkButton } from './index.js';

afterEach(() => {
  delete document.documentElement.dataset['theme'];
});

test('renders a semantic anchor with the button styling contract', async () => {
  const ref = createRef<HTMLAnchorElement>();
  const screen = await render(
    <TRLinkButton
      appearance="outline"
      href="/racks"
      intent="primary"
      ref={ref}
      uiSize="lg"
    >
      Racks
    </TRLinkButton>,
  );
  const control = screen.getByRole('link', { name: 'Racks' });

  // The whole point: it is a link, not a button.
  await expect.element(control).toHaveRole('link');
  await expect.element(control).toHaveClass('tr-btn', 'tr-link-btn');
  expect(ref.current?.pathname).toBe('/racks');
  expect(ref.current?.dataset['appearance']).toBe('outline');
  expect(ref.current?.dataset['intent']).toBe('primary');
  expect(ref.current?.dataset['uiSize']).toBe('lg');
});

test('applies distinct button styling per intent and drops the link underline', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <div>
      <TRLinkButton data-testid="primary" href="/primary" intent="primary">
        Primary
      </TRLinkButton>
      <TRLinkButton data-testid="neutral" href="/neutral" intent="neutral">
        Neutral
      </TRLinkButton>
    </div>,
  );
  const primary = document.querySelector<HTMLElement>('[data-testid="primary"]');
  const neutral = document.querySelector<HTMLElement>('[data-testid="neutral"]');

  expect(getComputedStyle(primary as HTMLElement).backgroundColor).not.toBe(
    getComputedStyle(neutral as HTMLElement).backgroundColor,
  );
  expect(getComputedStyle(primary as HTMLElement).textDecorationLine).toBe('none');
});

test('matches TRButton color and background for the same intent and appearance', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <div>
      <TRButton appearance="solid" data-testid="button" intent="primary">
        Button
      </TRButton>
      <TRLinkButton
        appearance="solid"
        data-testid="link-button"
        href="/racks"
        intent="primary"
      >
        Link button
      </TRLinkButton>
    </div>,
  );
  const button = document.querySelector<HTMLElement>('[data-testid="button"]');
  const linkButton = document.querySelector<HTMLElement>('[data-testid="link-button"]');

  // The anchor keeps the button's resolved intent color instead of the
  // user-agent link color.
  expect(getComputedStyle(linkButton as HTMLElement).color).toBe(
    getComputedStyle(button as HTMLElement).color,
  );
  expect(getComputedStyle(linkButton as HTMLElement).backgroundColor).toBe(
    getComputedStyle(button as HTMLElement).backgroundColor,
  );
});

test('preserves native attributes, refs, styles, classes, and events', async () => {
  const onFocus = vi.fn();
  const ref = createRef<HTMLAnchorElement>();
  const screen = await render(
    <TRLinkButton
      aria-current="page"
      className="inventory-link"
      href="#current"
      onFocus={onFocus}
      ref={ref}
      style={{ inlineSize: '12rem' }}
    >
      Current inventory
    </TRLinkButton>,
  );
  const control = screen.getByRole('link', { name: 'Current inventory' });

  await userEvent.tab();
  await expect.element(control).toHaveFocus();
  await expect.element(control).toHaveAttribute('aria-current', 'page');
  await expect.element(control).toHaveClass('tr-btn', 'inventory-link');
  expect(getComputedStyle(ref.current as HTMLAnchorElement).inlineSize).toBe('192px');
  expect(onFocus).toHaveBeenCalledOnce();
});

test('blocks pointer and keyboard navigation when disabled', async () => {
  const onClick = vi.fn();
  const onKeyDown = vi.fn();
  await render(
    <TRLinkButton
      disabled
      href="#disabled-destination"
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      Disabled destination
    </TRLinkButton>,
  );
  const control = document.querySelector<HTMLAnchorElement>('.tr-link-btn');
  expect(control?.hasAttribute('href')).toBe(false);
  expect(control?.getAttribute('aria-disabled')).toBe('true');
  control?.focus();
  await userEvent.keyboard('{Enter}');
  control?.click();
  expect(onClick).not.toHaveBeenCalled();
  expect(window.location.hash).not.toBe('#disabled-destination');
});

test('forwards pointer and keyboard interactions when enabled', async () => {
  const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  });
  const onKeyDown = vi.fn();
  await render(
    <TRLinkButton href="#enabled" onClick={onClick} onKeyDown={onKeyDown}>
      Enabled destination
    </TRLinkButton>,
  );
  const control = document.querySelector<HTMLAnchorElement>('.tr-link-btn');

  await userEvent.click(control as HTMLAnchorElement);
  control?.focus();
  await userEvent.keyboard('{ArrowRight}');

  expect(onClick).toHaveBeenCalledOnce();
  expect(onKeyDown).toHaveBeenCalledOnce();
  expect(onKeyDown.mock.calls[0]?.[0].key).toBe('ArrowRight');
  expect(window.location.hash).not.toBe('#enabled');
});

test('composes a router-style rendered anchor without DOM nesting', async () => {
  await render(
    <TRLinkButton href="/racks" render={<a data-router-link="true" href="/racks" />}>
      Racks
    </TRLinkButton>,
  );
  const control = document.querySelector<HTMLAnchorElement>(
    '[data-router-link="true"]',
  );
  expect(control?.classList.contains('tr-btn')).toBe(true);
  expect(control?.classList.contains('tr-link-btn')).toBe(true);
  expect(control?.getAttribute('role')).not.toBe('button');
  expect(control?.pathname).toBe('/racks');
  expect(control?.querySelector('a')).toBeNull();
});

test('removes the destination supplied by a rendered anchor when disabled', async () => {
  const onClick = vi.fn();
  await render(
    <TRLinkButton
      disabled
      onClick={onClick}
      render={<a data-router-link="disabled" href="#router-destination" />}
    >
      Disabled router destination
    </TRLinkButton>,
  );
  const control = document.querySelector<HTMLAnchorElement>(
    '[data-router-link="disabled"]',
  );
  expect(control?.hasAttribute('href')).toBe(false);
  control?.click();
  expect(onClick).not.toHaveBeenCalled();
  expect(window.location.hash).not.toBe('#router-destination');
});

test('server renders and hydrates without a mismatch', async () => {
  const fixture = (
    <div>
      <TRLinkButton href="/racks" intent="primary">
        Racks
      </TRLinkButton>
      <TRLinkButton render={<a data-router-link="ssr" href="/settings" />}>
        Settings
      </TRLinkButton>
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
  expect(host.querySelectorAll('.tr-link-btn')).toHaveLength(2);
  expect(
    consoleError.mock.calls.some((call) => String(call[0]).includes('hydration')),
  ).toBe(false);
  await act(async () => root?.unmount());
  host.remove();
  consoleError.mockRestore();
});
