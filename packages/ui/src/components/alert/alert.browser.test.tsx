import '../../core/core.css';
import './alert.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRAlert, TRAlertRoot } from './index.js';

test('assembles all alert parts in index.tsx', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  expect(TRAlert.Root).toBe(TRAlertRoot);
  await render(
    <TRAlert.Root data-testid="alert" variant="warning">
      <TRAlert.Title>Attention</TRAlert.Title>
      <TRAlert.Description>Review this change.</TRAlert.Description>
      <TRAlert.Actions>
        <button type="button">Review</button>
      </TRAlert.Actions>
    </TRAlert.Root>,
  );

  const root = document.querySelector<HTMLElement>('[data-testid="alert"]');
  expect(root?.dataset['variant']).toBe('warning');
  const title = root?.querySelector<HTMLElement>('.tr-alert-title');
  const actions = root?.querySelector<HTMLElement>('.tr-alert-actions');
  expect(title?.textContent).toBe('Attention');
  expect(getComputedStyle(title as HTMLElement).fontWeight).not.toBe('400');
  expect(getComputedStyle(actions as HTMLElement).display).toBe('flex');
  expect(getComputedStyle(actions as HTMLElement).flexWrap).toBe('wrap');
});

test('forwards an application-selected announcement role', async () => {
  await render(
    <div>
      <TRAlert.Root data-testid="polite" role="status" variant="success">
        <TRAlert.Title>Backup complete</TRAlert.Title>
      </TRAlert.Root>
      <TRAlert.Root data-testid="urgent" role="alert" variant="danger">
        <TRAlert.Title>Connection lost</TRAlert.Title>
      </TRAlert.Root>
    </div>,
  );
  expect(document.querySelector('[data-testid="polite"]')?.getAttribute('role')).toBe(
    'status',
  );
  expect(document.querySelector('[data-testid="urgent"]')?.getAttribute('role')).toBe(
    'alert',
  );
});

test('uses a neutral title by default and supports a contextual heading', async () => {
  await render(
    <>
      <TRAlert.Root>
        <TRAlert.Title>Neutral title</TRAlert.Title>
      </TRAlert.Root>
      <TRAlert.Root>
        <TRAlert.Title render={<h4>Contextual title</h4>} />
      </TRAlert.Root>
    </>,
  );

  expect(document.querySelector('.tr-alert-title')?.tagName).toBe('DIV');
  expect(document.querySelector('h4.tr-alert-title')?.textContent).toBe(
    'Contextual title',
  );
});
