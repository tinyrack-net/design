import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectElementParity } from '../../../e2e/fixtures/component-browser-harness.js';
import { toastPositions } from './contract.js';
import { ToastViewport } from './react.js';

test.each(toastPositions)('ToastViewport DOM/React parity for %s', async (position) => {
  const raw = document.createElement('section');
  raw.className = 'tr-toast-viewport';
  raw.dataset['position'] = position;
  raw.dataset['trToastViewport'] = 'true';
  raw.setAttribute('aria-label', 'Notifications');
  raw.setAttribute('popover', 'manual');
  document.body.append(raw);
  const rendered = await render(<ToastViewport position={position} />);
  expectElementParity(raw, rendered.container.querySelector('.tr-toast-viewport')!);
  raw.remove();
});
