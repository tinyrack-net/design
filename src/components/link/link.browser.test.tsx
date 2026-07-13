import '../../core/core.css';
import './link.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Link } from './index.js';

test('renders a semantic anchor with Tinyrack variants', async () => {
  const ref = createRef<HTMLAnchorElement>();
  await render(
    <Link ref={ref} href="/docs" underline="always" variant="primary">
      Docs
    </Link>,
  );
  expect(ref.current?.pathname).toBe('/docs');
  expect(ref.current?.dataset['underline']).toBe('always');
});

test('maps the default and muted public variants to their semantic colors', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <div>
      <Link data-testid="default" href="/default" variant="default">
        Default
      </Link>
      <Link data-testid="muted" href="/muted" variant="muted">
        Muted
      </Link>
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
      <Link
        data-testid="external"
        href="https://tinyrack.net"
        rel="noreferrer"
        target="_blank"
      >
        Tinyrack website (opens in new tab)
      </Link>
      <Link
        data-testid="download"
        download="rack-inventory.csv"
        href="/rack-inventory.csv"
      >
        Download inventory
      </Link>
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
