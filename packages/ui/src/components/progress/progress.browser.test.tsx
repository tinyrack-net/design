import './progress.css';
import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Progress, ProgressRoot } from './index.js';

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

test('assembles an accessible progress indicator', async () => {
  expect(Progress.Root).toBe(ProgressRoot);
  await render(
    <Progress.Root size="lg" value={65} variant="success">
      <Progress.Label>Deploy</Progress.Label>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
      <Progress.Value />
    </Progress.Root>,
  );
  const root = document.querySelector<HTMLElement>('.tr-progress');
  expect(root?.getAttribute('role')).toBe('progressbar');
  expect(root?.getAttribute('aria-valuenow')).toBe('65');
  expect(root?.dataset['variant']).toBe('success');
  expect(page.getByRole('progressbar', { name: 'Deploy' }).element()).toBe(root);
});

test('renders an indeterminate state without a fabricated current value', async () => {
  await render(
    <Progress.Root value={null}>
      <Progress.Label>Indexing</Progress.Label>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
    </Progress.Root>,
  );
  const root = document.querySelector<HTMLElement>('.tr-progress');
  const indicator = document.querySelector<HTMLElement>('.tr-progress-indicator');
  expect(root?.hasAttribute('data-indeterminate')).toBe(true);
  expect(root?.hasAttribute('aria-valuenow')).toBe(false);
  expect(root?.getAttribute('aria-valuetext')).toBe('indeterminate progress');
  expect(indicator?.hasAttribute('data-indeterminate')).toBe(true);
  expect(
    Number.parseFloat(getComputedStyle(indicator as HTMLElement).width),
  ).toBeGreaterThan(0);
  expect(page.getByRole('progressbar', { name: 'Indexing' }).element()).toBe(root);
});

test('preserves its accessible name through narrow SSR hydration', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const fixture = (
    <div style={{ width: 320 }}>
      <Progress.Root size="sm" value={25} variant="info">
        <Progress.Label>Mobile upload</Progress.Label>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
        <Progress.Value />
      </Progress.Root>
    </div>
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
  const progress = host.querySelector<HTMLElement>('[role="progressbar"]');
  const labelId = progress?.getAttribute('aria-labelledby');
  expect(hydrationErrors).toEqual([]);
  expect(labelId).toBeTruthy();
  expect(host.querySelector(`#${labelId}`)?.textContent).toBe('Mobile upload');
  expect(progress?.clientWidth).toBeLessThanOrEqual(320);

  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});
