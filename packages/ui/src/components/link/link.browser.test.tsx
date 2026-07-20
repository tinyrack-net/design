import '../../core/core.css';
import './link.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRLink } from './index.js';

test('renders a semantic anchor with Tinyrack variants', async () => {
  const ref = createRef<HTMLAnchorElement>();
  await render(
    <TRLink ref={ref} href="/docs" underline="always" variant="danger">
      Docs
    </TRLink>,
  );
  expect(ref.current?.pathname).toBe('/docs');
  expect(ref.current?.dataset['underline']).toBe('always');
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
