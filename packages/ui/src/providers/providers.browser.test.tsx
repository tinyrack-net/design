import { act, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import type { TRCodeHighlighter } from '../components/code-block/index.js';
import { TRScrollArea } from '../components/scroll-area/index.js';
import { TRColorSchemeProvider, useTinyrackColorScheme } from './color-scheme/index.js';
import { TRCSPProvider } from './csp/index.js';
import { TRDirectionProvider, useDirection } from './direction/index.js';
import {
  TRCodeHighlighterProvider,
  useTRCodeHighlighter,
} from './highlighter/index.js';

const noopHighlighter: TRCodeHighlighter = async () => null;

function DirectionProbe() {
  const direction = useDirection();
  return <output data-testid="direction">{direction}</output>;
}

function HighlighterProbe() {
  const { highlighter } = useTRCodeHighlighter();
  return (
    <output data-testid="highlighter">
      {highlighter === null ? 'none' : 'configured'}
    </output>
  );
}

test('composes CSP, direction, and highlighter behavior through public providers', async () => {
  const screen = await render(
    <TRCSPProvider nonce="tinyrack-test-nonce">
      <TRDirectionProvider direction="rtl">
        <TRCodeHighlighterProvider highlighter={noopHighlighter}>
          <DirectionProbe />
          <HighlighterProbe />
        </TRCodeHighlighterProvider>
      </TRDirectionProvider>
    </TRCSPProvider>,
  );

  await expect.element(screen.getByTestId('direction')).toHaveTextContent('rtl');
  await expect
    .element(screen.getByTestId('highlighter'))
    .toHaveTextContent('configured');
});

test('reports no highlighter outside a provider', async () => {
  const screen = await render(<HighlighterProbe />);
  await expect.element(screen.getByTestId('highlighter')).toHaveTextContent('none');
});

function ScrollAreaFixture() {
  return (
    <TRScrollArea.Root style={{ height: 80, width: 160 }}>
      <TRScrollArea.Viewport>
        <TRScrollArea.Content style={{ height: 160 }}>Events</TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar>
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
    </TRScrollArea.Root>
  );
}

test('controls Base UI style element rendering', async () => {
  await render(
    <div>
      <TRCSPProvider>
        <ScrollAreaFixture />
      </TRCSPProvider>
      <TRCSPProvider disableStyleElements>
        <ScrollAreaFixture />
      </TRCSPProvider>
    </div>,
  );

  expect(
    document.querySelectorAll('style[data-href="base-ui-disable-scrollbar"]'),
  ).toHaveLength(1);
});

function DirectionHarness() {
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  return (
    <div data-testid="direction-document" dir={direction}>
      <TRDirectionProvider direction={direction}>
        <DirectionProbe />
        <button
          onClick={() => setDirection((current) => (current === 'ltr' ? 'rtl' : 'ltr'))}
          type="button"
        >
          Toggle direction
        </button>
      </TRDirectionProvider>
    </div>
  );
}

test('keeps native direction and provider context synchronized across updates', async () => {
  await render(<DirectionHarness />);
  const documentRoot = document.querySelector<HTMLElement>(
    '[data-testid="direction-document"]',
  );
  expect(documentRoot?.dir).toBe('ltr');
  await expect.element(page.getByTestId('direction')).toHaveTextContent('ltr');

  await page.getByRole('button', { name: 'Toggle direction' }).click();
  expect(documentRoot?.dir).toBe('rtl');
  await expect.element(page.getByTestId('direction')).toHaveTextContent('rtl');
});

test('providers render on the server and hydrate without recovery', async () => {
  const actEnvironment = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const fixture = (
    <TRCSPProvider nonce="server-nonce">
      <TRDirectionProvider direction="rtl">
        <TRCodeHighlighterProvider highlighter={noopHighlighter}>
          <DirectionProbe />
        </TRCodeHighlighterProvider>
      </TRDirectionProvider>
    </TRCSPProvider>
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
  expect(host.querySelector('output')?.textContent).toBe('rtl');

  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});

function ColorSchemeProbe() {
  const { applied, preference, setPreference } = useTinyrackColorScheme();
  return (
    <>
      <output data-testid="color-scheme">
        {preference}:{applied}
      </output>
      <button onClick={() => setPreference('dark')} type="button">
        Use dark
      </button>
    </>
  );
}

test('persists and applies color scheme changes through the provider', async () => {
  localStorage.removeItem('provider-theme-test');
  const screen = await render(
    <TRColorSchemeProvider defaultPreference="light" storageKey="provider-theme-test">
      <ColorSchemeProbe />
    </TRColorSchemeProvider>,
  );

  await expect
    .element(screen.getByTestId('color-scheme'))
    .toHaveTextContent('light:tinyrack-light');
  await page.getByRole('button', { name: 'Use dark' }).click();
  await expect
    .element(screen.getByTestId('color-scheme'))
    .toHaveTextContent('dark:tinyrack-dark');
  expect(document.documentElement.dataset['theme']).toBe('tinyrack-dark');
  expect(document.documentElement.style.colorScheme).toBe('dark');
  expect(localStorage.getItem('provider-theme-test')).toBe('dark');
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.colorScheme = '';
  localStorage.removeItem('provider-theme-test');
});
