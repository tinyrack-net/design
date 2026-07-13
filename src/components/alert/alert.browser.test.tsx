import './alert.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Alert, AlertRoot } from './index.js';

test('assembles all alert parts in index.tsx', async () => {
  expect(Alert.Root).toBe(AlertRoot);
  await render(
    <Alert.Root data-testid="alert" variant="warning">
      <Alert.Title>Attention</Alert.Title>
      <Alert.Description>Review this change.</Alert.Description>
      <Alert.Actions>
        <button type="button">Review</button>
      </Alert.Actions>
    </Alert.Root>,
  );

  const root = document.querySelector<HTMLElement>('[data-testid="alert"]');
  expect(root?.dataset['variant']).toBe('warning');
  expect(root?.querySelector('.tr-alert-title')?.textContent).toBe('Attention');
});

test('forwards an application-selected announcement role', async () => {
  await render(
    <div>
      <Alert.Root data-testid="polite" role="status" variant="success">
        <Alert.Title>Backup complete</Alert.Title>
      </Alert.Root>
      <Alert.Root data-testid="urgent" role="alert" variant="danger">
        <Alert.Title>Connection lost</Alert.Title>
      </Alert.Root>
    </div>,
  );
  expect(document.querySelector('[data-testid="polite"]')?.getAttribute('role')).toBe(
    'status',
  );
  expect(document.querySelector('[data-testid="urgent"]')?.getAttribute('role')).toBe(
    'alert',
  );
});
