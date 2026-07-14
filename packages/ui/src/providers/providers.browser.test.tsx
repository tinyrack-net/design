import { act, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { ScrollArea } from '../components/scroll-area/index.js';
import { CSPProvider } from './csp/index.js';
import { DirectionProvider, useDirection } from './direction/index.js';

function DirectionProbe() {
  const direction = useDirection();
  return <output data-testid="direction">{direction}</output>;
}

test('composes CSP and direction behavior through public providers', async () => {
  const screen = await render(
    <CSPProvider nonce="tinyrack-test-nonce">
      <DirectionProvider direction="rtl">
        <DirectionProbe />
      </DirectionProvider>
    </CSPProvider>,
  );

  await expect.element(screen.getByTestId('direction')).toHaveTextContent('rtl');
});

function ScrollAreaFixture() {
  return (
    <ScrollArea.Root style={{ height: 80, width: 160 }}>
      <ScrollArea.Viewport>
        <ScrollArea.Content style={{ height: 160 }}>Events</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

test('controls Base UI style element rendering', async () => {
  await render(
    <div>
      <CSPProvider>
        <ScrollAreaFixture />
      </CSPProvider>
      <CSPProvider disableStyleElements>
        <ScrollAreaFixture />
      </CSPProvider>
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
      <DirectionProvider direction={direction}>
        <DirectionProbe />
        <button
          onClick={() => setDirection((current) => (current === 'ltr' ? 'rtl' : 'ltr'))}
          type="button"
        >
          Toggle direction
        </button>
      </DirectionProvider>
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
    <CSPProvider nonce="server-nonce">
      <DirectionProvider direction="rtl">
        <DirectionProbe />
      </DirectionProvider>
    </CSPProvider>
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
