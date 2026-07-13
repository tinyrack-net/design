import './progress.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Progress, ProgressRoot } from './index.js';

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
});
